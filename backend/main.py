from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
import asyncio

# 우리가 만든 모듈들 불러오기
from schemas import GenerateRequest
import ai_service
import db_service

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL explicitly specified
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST, OPTIONS 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

@app.post("/generate")
async def generate_story(req: GenerateRequest):
    print(f"\n=============================================")
    print(f"📥 [주문 접수] 아이: {req.child_name}, 감정: {req.emotion}, 진도: {req.stage_code}")
    print(f"=============================================")
    
    # ----------------------------------------------------
    # Step 1. 창고에서 교재 텍스트 꺼내오기
    # ----------------------------------------------------
    try:
        curriculum_title, source_text = db_service.get_curriculum(req.stage_code)
        print(f"✅ [Step 1] DB 조회 성공: {curriculum_title}")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


    # ----------------------------------------------------
    # Step 2. GPT 요리사에게 텍스트 대본 및 프롬프트 맡기기
    # ----------------------------------------------------
    try:
        story_draft = ai_service.generate_story_draft(
            child_name=req.child_name,
            age=req.age,
            personality=req.personality,
            emotion=req.emotion,
            source_text=source_text
        )
        print(f"✅ [Step 2] 대본 생성 완료: {story_draft.title}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"대본 생성 실패: {str(e)}")


    # ----------------------------------------------------
    # Step 3. 비동기 공장 가동! (DALL-E 그림 5장 + TTS 음성 5개 동시 생성)
    # ----------------------------------------------------
    try:
        raw_media_results = await ai_service.generate_all_media_parallel(story_draft.scenes)
        print(f"✅ [Step 3] 비동기 미디어 생성 완료 (총 {len(raw_media_results)}개 파일)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"미디어 생성 실패: {str(e)}")


# ----------------------------------------------------
    # Step 4. 생성된 파일들을 Supabase 창고에 업로드 
    # ----------------------------------------------------
    print("\n📦 [Step 4] 생성된 파일들을 Supabase 창고에 안전하게 순서대로 업로드합니다...")
    
    upload_results = []
    for item in raw_media_results:
        scene_no = item["scene_no"]
        m_type = item["type"]
        data = item["data"]

        # 데이터가 없으면 패스
        if not data:
            continue

        if m_type == "image":
            # 이미지는 DALL-E 주소에서 다운받아 업로드 (이건 이미 잘 됨!)
            perm_url = await db_service.save_image_from_url(data)
            upload_results.append((scene_no, "image_url", perm_url))
            print(f"   -> 🎨 {scene_no}번 씬 [그림] 업로드 완료!")
            
        elif m_type == "audio":
            # 🚨 꼼수(to_thread) 제거! 메인 스레드에서 다이렉트로 안전하게 업로드
            perm_url = db_service.upload_to_supabase(data, ".mp3", "audio/mpeg")
            upload_results.append((scene_no, "audio_url", perm_url))
            print(f"   -> 🎵 {scene_no}번 씬 [음성] 업로드 완료!")

    print("✅ [Step 4] 창고 업로드 완벽 종료!")


    # ----------------------------------------------------
    # Step 5. 최종 JSON 조립 및 DB 저장
    # ----------------------------------------------------
    print("\n🎁 [Step 5] 최종 JSON 조립 및 DB 저장 중...")
    
    final_scenes = []
    for scene in story_draft.scenes:
        scene_dict = scene.model_dump() 
        for res in upload_results:
            if res[0] == scene.scene_no:
                scene_dict[res[1]] = res[2] 
        final_scenes.append(scene_dict)

    story_id = db_service.save_final_story(
        user_id=req.user_id,  
        stage_code=req.stage_code,
        emotion=req.emotion,
        title=story_draft.title,
        scenes_dict=final_scenes
    )

    # ----------------------------------------------------
    # Step 6. 프론트엔드로 배달! (Output)
    # ----------------------------------------------------
    print("🎉 모든 작업 완료! 프론트엔드로 데이터를 발송합니다.\n")
    return {
        "story_id": story_id,
        "title": story_draft.title,
        "summary": story_draft.summary,
        "created_at": "Just now", # 실제로는 DB의 created_at을 써도 됩니다.
        "pdf_url": "https://[PDF기능은_나중에_추가_예정].pdf",
        "scenes": final_scenes
    }

@app.get("/curriculums")
async def get_curriculums():
    """프론트엔드 '진도 선택' 화면에 보여줄 교재 목록을 반환합니다."""
    return db_service.get_all_curriculums()

@app.get("/stories/{story_id}")
async def get_story(story_id: str):
    """ID로 동화책 상세 조회"""
    try:
        story = db_service.get_story_by_id(story_id)
        return story
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)