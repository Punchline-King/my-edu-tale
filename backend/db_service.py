import os
import uuid
import httpx
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API = os.getenv("SUPABASE_API")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_API)
BUCKET_NAME = "edu-tale-assets"

# ==========================================
# 1. 교재 텍스트 꺼내오기 (DB Select)
# ==========================================
def get_curriculum(stage_code: str):
    print(f"🔍 [DB] 진도코드 '{stage_code}' 교재 검색 중...")
    response = supabase.table("curriculums").select("*").eq("stage_code", stage_code).execute()
    
    if not response.data:
        raise ValueError(f"진도 코드 '{stage_code}'를 찾을 수 없습니다.")
        
    data = response.data[0]
    return data["title"], data["source_text"]

# ==========================================
# 2. 파일 업로드 및 퍼블릭 URL 받기 (Storage)
# ==========================================
def upload_to_supabase(file_bytes: bytes, file_ext: str, content_type: str) -> str:
    """바이트 데이터를 받아 Supabase 스토리지에 올리고 공용 URL을 반환합니다."""
    # 파일 이름이 겹치지 않도록 UUID(랜덤 문자열)로 이름 짓기
    file_name = f"{uuid.uuid4()}{file_ext}"
    
    try:
        # 파일 업로드 (동일한 이름이 있으면 덮어쓰기 옵션 추가)
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_name, 
            file=file_bytes, 
            file_options={"content-type": content_type, "x-upsert": "true"}
        )
        
        # 업로드된 파일의 영구적인 퍼블릭 URL 가져오기
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)
        return public_url
    except Exception as e:
        print(f"❌ [Storage] 업로드 실패: {e}")
        return ""

# ==========================================
# 3. DALL-E 임시 URL을 가로채서 우리 창고에 저장하기
# ==========================================
async def save_image_from_url(dalle_url: str) -> str:
    """DALL-E의 2시간짜리 시한부 링크에서 이미지를 다운받아 Supabase에 영구 저장합니다."""
    if not dalle_url:
        return ""
        
    try:
        # 1. DALL-E 링크에서 이미지 다운로드
        async with httpx.AsyncClient() as client:
            response = await client.get(dalle_url)
            image_bytes = response.content
            
        # 2. 다운받은 이미지를 Supabase에 업로드 (.png)
        permanent_url = upload_to_supabase(image_bytes, ".png", "image/png")
        return permanent_url
    except Exception as e:
        print(f"❌ [Storage] 이미지 다운/업로드 실패: {e}")
        return ""

# ==========================================
# 4. 최종 완성된 JSON 스토리 DB에 저장하기 (DB Insert)
# ==========================================
def save_final_story(user_id: str, stage_code: str, emotion: str, title: str, scenes_dict: list) -> str:
    print(f"💾 [DB] 최종 동화책 '{title}' 데이터 저장 중...")
    
    data = {
        "user_id": user_id, 
        "stage_code": stage_code,
        "emotion": emotion,
        "title": title,
        "scenes": scenes_dict # 프론트엔드가 렌더링할 그 완벽한 JSON 배열
    }
    
    response = supabase.table("stories").insert(data).execute()
    saved_id = response.data[0]["id"]
    print(f"✅ [DB] 동화책 저장 완료! (Story ID: {saved_id})")
    
    return saved_id