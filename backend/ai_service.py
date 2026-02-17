import os
import asyncio
from openai import OpenAI, AsyncOpenAI
from dotenv import load_dotenv
from schemas import StoryDraft

# ==========================================
# 0. 환경설정 및 클라이언트 준비
# ==========================================
load_dotenv() # .env 파일에서 API 키 불러오기

# GPT 텍스트 생성용 (동기식 클라이언트)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# DALL-E 그림 및 TTS 음성 동시 생성용 (비동기식 클라이언트)
aclient = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ==========================================
# 1. [총괄 셰프] GPT-4o 스토리 & 퀴즈 대본 생성 (Structured Outputs)
# ==========================================
def generate_story_draft(child_name: str, age: int, personality: str, emotion: str, source_text: str) -> StoryDraft:
    print("\n⏳ [GPT-4o] 동화 대본 및 이미지 프롬프트 생성 중...")
    
    system_prompt = f"""
    당신은 {age}살 아이들의 마음을 읽어주는 최고의 맞춤형 동화 작가이자 교육 전문가입니다.
    아이의 이름은 '{child_name}'이고, 성향은 '{personality}'이며, 현재 기분은 '{emotion}' 상태입니다.
    
    이 아이를 달래주기 위해, 아래의 [학습 개념]을 자연스럽게 녹여낸 5장짜리 동화책 대본을 작성하세요.
    
    [학습 개념]
    {source_text}
    
    [작성 규칙]
    1. 주인공의 이름은 반드시 '{child_name}'으로 하세요.
    2. 총 5개의 씬(scene)으로 구성하세요. 
    3. 3번 씬과 5번 씬에는 반드시 [학습 개념]과 관련된 퀴즈(quiz)를 넣으세요. 나머지 씬의 quiz는 null로 비워두세요.
    4. 각 씬마다 DALL-E 3가 그림을 그릴 수 있도록, 'image_prompt'를 상세한 영어로 작성하세요. (수채화 풍의 따뜻한 동화책 스타일을 묘사할 것)
    5. 모든 동화 내용, 대사, 퀴즈는 반드시 '한국어'로 작성하세요. (단, DALL-E를 위한 image_prompt는 반드시 영어로 유지할 것)
    """

    # GPT-4o 호출 (Structured Outputs 기능으로 JSON 틀 강제)
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "규격에 맞춰서 동화책 JSON 데이터를 생성해줘."}
        ],
        response_format=StoryDraft, 
    )

    story_draft = completion.choices[0].message.parsed
    print(f"✅ [GPT-4o] 대본 생성 완료! 제목: {story_draft.title}")
    
    return story_draft


# ==========================================
# 2. [보조 셰프 1] DALL-E 3 이미지 1장 생성 (비동기)
# ==========================================
async def generate_image(prompt: str, scene_no: int):
    print(f"🎨 [{scene_no}번 씬] 그림 그리는 중...")
    try:
        response = await aclient.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard", # 해커톤 속도 최적화를 위해 standard 사용
            n=1,
        )
        print(f"✅ [{scene_no}번 씬] 그림 완성!")
        return {"scene_no": scene_no, "type": "image", "data": response.data[0].url}
    except Exception as e:
        print(f"❌ [{scene_no}번 씬] 그림 실패: {e}")
        return {"scene_no": scene_no, "type": "image", "data": ""}


# ==========================================
# 3. [보조 셰프 2] TTS 음성 1개 녹음 (비동기)
# ==========================================
async def generate_audio(text: str, scene_no: int):
    print(f"🎵 [{scene_no}번 씬] 성우 녹음 중...")
    try:
        response = await aclient.audio.speech.create(
            model="tts-1", # tts-1-hd 보다 빠름
            voice="nova",  # 친절한 여성 목소리 (alloy, echo, fable, onyx, nova, shimmer 중 택1)
            input=text
        )
        print(f"✅ [{scene_no}번 씬] 녹음 완성!")
        # 오디오는 URL이 아니라 실제 바이트(Bytes) 데이터를 읽어옵니다.
        return {"scene_no": scene_no, "type": "audio", "data": response.read()}
    except Exception as e:
        print(f"❌ [{scene_no}번 씬] 녹음 실패: {e}")
        return {"scene_no": scene_no, "type": "audio", "data": None}


# ==========================================
# 4. ★ [공장장] 그림 5개 & 음성 5개 10-Track 동시 생성기 ★
# ==========================================
async def generate_all_media_parallel(scenes):
    print("\n🚀 [비동기 공장 가동] 그림 5장, 음성 5개 동시 주문 들어갑니다!")
    tasks = []

    for scene in scenes:
        # 10개의 주문서를 하나의 리스트에 모음
        tasks.append(generate_image(scene.image_prompt, scene.scene_no))
        tasks.append(generate_audio(scene.text, scene.scene_no))

    # asyncio.gather: 10개의 작업을 OpenAI 서버로 동시에 쏘고, 다 돌아올 때까지 대기
    results = await asyncio.gather(*tasks)
    
    print("🎉 [비동기 공장 완료] 10개 파일 생성 모두 종료!\n")
    return results