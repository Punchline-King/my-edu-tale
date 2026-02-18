/**
 * API Service for Backend Communication
 * Handles all requests to the FastAPI backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Backend API Request Types
 */
export interface GenerateStoryRequest {
    child_name: string;
    age: number;
    personality: string;
    emotion: string;
    stage_code: string;
    user_id?: string; // Added to link story to user
}

/**
 * Quiz structure from backend
 */
export interface BackendQuiz {
    type: 'choice' | 'short_answer';
    question: string;
    answer: string;
    correct_msg: string;
    wrong_msg: string;
}

/**
 * Scene structure from backend
 */
export interface BackendScene {
    scene_no: number;
    text: string;
    image_prompt: string;
    image_url: string;
    audio_url: string;
    quiz: BackendQuiz | null;
}

/**
 * Story generation response from backend
 */
export interface GenerateStoryResponse {
    story_id: string;
    title: string;
    summary: string;
    created_at: string;
    pdf_url: string;
    scenes: BackendScene[];
}

/**
 * API Error class
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Generate a custom story
 * 
 * @param request - Story generation request data
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with generated story data
 */
export async function generateStory(
    request: GenerateStoryRequest,
    onProgress?: (message: string) => void
): Promise<GenerateStoryResponse> {
    try {
        onProgress?.('AI가 맞춤 동화를 만들고 있어요...');

        // Fixed: Removed /api prefix to match backend main.py
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new ApiError(
                error.detail || '스토리 생성에 실패했습니다.',
                response.status,
                error
            );
        }

        onProgress?.('스토리 생성 완료!');

        const data: GenerateStoryResponse = await response.json();
        return data;

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or other errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(
                '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
                0
            );
        }

        throw new ApiError(
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
            0
        );
    }
}

/**
 * Fetch a story by ID (for sharing/revisiting)
 * Note: This endpoint needs to be added to the backend
 * 
 * @param storyId - Story UUID
 * @returns Promise with story data
 */
export async function fetchStory(storyId: string): Promise<GenerateStoryResponse> {
    try {
        const response = await fetch(`${API_URL}/stories/${storyId}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new ApiError('스토리를 찾을 수 없습니다.', 404);
            }
            throw new ApiError('스토리를 불러올 수 없습니다.', response.status);
        }

        const data: GenerateStoryResponse = await response.json();
        return data;

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error instanceof Error ? error.message : '스토리를 불러올 수 없습니다.',
            0
        );
    }
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/docs`, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}
