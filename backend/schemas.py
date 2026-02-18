# schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional

# 1. 프론트가 백엔드로 보낼 때의 규격 (Input)
class GenerateRequest(BaseModel):
    user_id: Optional[str] = None
    child_name: str
    age: int
    personality: str
    emotion: str
    stage_code: str

# 2. GPT가 만들어낼 '퀴즈' 규격
class QuizSchema(BaseModel):
    type: str = Field(description="주관식은 'short_answer', 객관식은 'choice'")
    question: str = Field(description="아이에게 던질 퀴즈 질문")
    answer: str = Field(description="퀴즈의 정답 (문자열로 작성, 예: '2')")
    correct_msg: str = Field(description="정답을 맞췄을 때 칭찬 메시지")
    wrong_msg: str = Field(description="틀렸을 때 격려하는 메시지")

# 3. GPT가 만들어낼 '1개의 장면' 규격
class SceneSchema(BaseModel):
    scene_no: int
    text: str = Field(description="이 장면에 들어갈 동화책 내레이션 대사")
    image_prompt: str = Field(description="이 장면을 DALL-E 3로 그리기 위한 영문 프롬프트 (최대한 상세하게)")
    # 프론트가 쓸 임시 빈칸 (나중에 백엔드가 채워줌)
    image_url: str = "" 
    audio_url: str = ""
    # 퀴즈가 없는 장면도 있으므로 Optional 처리
    quiz: Optional[QuizSchema] = Field(None, description="이 장면에 퀴즈가 없다면 null")

# 4. GPT가 최종적으로 뱉어낼 '전체 스토리' 규격
class StoryDraft(BaseModel):
    title: str = Field(description="동화책의 지어낸 제목")
    summary: str = Field(description="전체 이야기 요약")
    scenes: List[SceneSchema] = Field(description="반드시 5개의 장면을 생성할 것")