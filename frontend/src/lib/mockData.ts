import type { Story, ChildInfo, GameSession } from "@/lib/types";

// Generate a story ID based on child info, emotion, and stage
export function generateStoryId(
    childInfo: ChildInfo,
    emotion: string,
    stage: string
): string {
    return `story-${childInfo.child_name}-${emotion}-${stage}-${Date.now()}`;
}

// Get mock story data based on emotion and stage
export function getMockStory(
    storyId: string,
    childInfo: ChildInfo | null,
    gameSession: GameSession | null
): Story {
    const name = childInfo?.child_name || "민준";
    const emotion = gameSession?.emotion || "happiness";
    const stage = gameSession?.stage || "1-1-1";

    // Story templates based on emotion
    const storyTemplates: Record<string, Story> = {
        anger: {
            story_id: storyId,
            title: `화난 ${name}이와 구구단 불꽃 공룡`,
            summary: `화가 난 ${name}이가 구구단 주문으로 불꽃 공룡을 잠재우는 모험 이야기`,
            created_at: new Date().toISOString(),
            scenes: [
                {
                    scene_no: 1,
                    text: `${name}이는 수학 숙제가 생각대로 되지 않아 머리 끝까지 화가 났어요.`,
                    image_url: "https://picsum.photos/seed/angry1/800/450",
                    audio_url: "/audio/scene1.mp3",
                    quiz: null,
                },
                {
                    scene_no: 2,
                    text: "그때, 책상 위에서 구구단 주문을 외우는 작은 불꽃 공룡이 나타났어요.",
                    image_url: "https://picsum.photos/seed/dragon/800/450",
                    audio_url: "/audio/scene2.mp3",
                    quiz: null,
                },
                {
                    scene_no: 3,
                    text: "공룡은 '이일은 이!'라고 소리치며 화난 민준이의 마음을 달래주었죠.",
                    image_url: "https://picsum.photos/seed/dragon2/800/450",
                    audio_url: "/audio/scene3.mp3",
                    quiz: {
                        type: "short_answer",
                        question: "공룡의 콧구멍의 숫자를 맞춰야 물리칠 수 있어요! 공룡의 콧구멍 숫자는?",
                        answer: "2",
                        correct_msg: "정답! 공룡이 콧김을 뿜으며 물러납니다.",
                        wrong_msg: "틀렸어요. 다시 세어볼까요?",
                    },
                },
                {
                    scene_no: 4,
                    text: `${name}이는 공룡을 따라 구구단을 외우자 마음이 차분해지는 걸 느꼈어요.`,
                    image_url: "https://picsum.photos/seed/calm/800/450",
                    audio_url: "/audio/scene4.mp3",
                    quiz: null,
                },
                {
                    scene_no: 5,
                    text: `이제 ${name}이는 수학이 무섭지 않아요. 구구단 공룡과 친구가 되었거든요!`,
                    image_url: "https://picsum.photos/seed/happy/800/450",
                    audio_url: "/audio/scene5.mp3",
                    quiz: {
                        type: "short_answer",
                        question: "공룡 눈깔의 숫자를 맞춰야 물리칠 수 있어요! 공룡의 눈깔 숫자는?",
                        answer: "2",
                        correct_msg: "와우! 이제 정말 친구가 되었어요.",
                        wrong_msg: "눈을 크게 뜨고 다시 봐요!",
                    },
                },
            ],
        },
        happiness: {
            story_id: storyId,
            title: `행복한 ${name}이와 숫자 나라 모험`,
            summary: `즐거운 ${name}이가 숫자 나라에서 덧셈 마법을 배우는 이야기`,
            created_at: new Date().toISOString(),
            scenes: [
                {
                    scene_no: 1,
                    text: `${name}이는 오늘 정말 기분이 좋아요! 수학 문제를 풀면서 노래를 불렀어요.`,
                    image_url: "/test_space_panorama.png",
                    audio_url: "/audio/happy1.mp3",
                    quiz: null,
                },
                {
                    scene_no: 2,
                    text: "갑자기 책에서 빛이 나더니, 숫자 요정이 나타났어요!",
                    image_url: "https://picsum.photos/seed/fairy/800/450",
                    audio_url: "/audio/happy2.mp3",
                    quiz: null,
                },
                {
                    scene_no: 3,
                    text: "요정은 숫자 마법을 가르쳐 주겠대요. 1 + 1은 무엇일까요?",
                    image_url: "https://picsum.photos/seed/magic/800/450",
                    audio_url: "/audio/happy3.mp3",
                    quiz: {
                        type: "short_answer",
                        question: "1 + 1은 무엇일까요?",
                        answer: "2",
                        correct_msg: "맞아요! 반짝반짝 별이 쏟아져요!",
                        wrong_msg: "다시 한번 생각해볼까요?",
                    },
                },
                {
                    scene_no: 4,
                    text: `${name}이는 숫자 마법을 배워서 더 행복해졌어요!`,
                    image_url: "https://picsum.photos/seed/magic2/800/450",
                    audio_url: "/audio/happy4.mp3",
                    quiz: null,
                },
                {
                    scene_no: 5,
                    text: "이제 덧셈은 식은 죽 먹기예요!",
                    image_url: "https://picsum.photos/seed/success/800/450",
                    audio_url: "/audio/happy5.mp3",
                    quiz: null,
                },
            ],
        },
        sadness: {
            story_id: storyId,
            title: `슬픈 ${name}이와 위로의 숫자들`,
            summary: `슬픈 ${name}이가 숫자 친구들을 만나 위로받는 이야기`,
            created_at: new Date().toISOString(),
            scenes: [
                {
                    scene_no: 1,
                    text: `${name}이는 오늘 슬픈 일이 있었어요. 눈물이 멈추지 않았어요.`,
                    image_url: "https://picsum.photos/seed/sad1/800/450",
                    audio_url: "/audio/sad1.mp3",
                    quiz: null,
                },
                {
                    scene_no: 2,
                    text: "그런데 숫자 1이 다가와서 위로해 주었어요. '혼자가 아니야!'",
                    image_url: "https://picsum.photos/seed/number1/800/450",
                    audio_url: "/audio/sad2.mp3",
                    quiz: null,
                },
                {
                    scene_no: 3,
                    text: "숫자들이 모여서 물었어요. '2 + 3은 무엇일까?'",
                    image_url: "https://picsum.photos/seed/numbers/800/450",
                    audio_url: "/audio/sad3.mp3",
                    quiz: {
                        type: "short_answer",
                        question: "2 + 3은 무엇일까요?",
                        answer: "5",
                        correct_msg: "잘했어요! 숫자 친구들이 웃어요!",
                        wrong_msg: "천천히 다시 세어봐요.",
                    },
                },
                {
                    scene_no: 4,
                    text: `${name}이는 숫자 친구들과 함께 있으니 마음이 따뜻해졌어요.`,
                    image_url: "https://picsum.photos/seed/warm/800/450",
                    audio_url: "/audio/sad4.mp3",
                    quiz: null,
                },
                {
                    scene_no: 5,
                    text: "이제 슬픔이 조금씩 사라지고 있어요.",
                    image_url: "https://picsum.photos/seed/better/800/450",
                    audio_url: "/audio/sad5.mp3",
                    quiz: null,
                },
            ],
        },
        fear: {
            story_id: storyId,
            title: `무서운 ${name}이와 용기의 방정식`,
            summary: `두려움을 이겨내고 수학으로 용기를 얻는 ${name}이의 이야기`,
            created_at: new Date().toISOString(),
            scenes: [
                {
                    scene_no: 1,
                    text: `${name}이는 어두운 방이 무서웠어요. 떨리는 손으로 수학 책을 폈어요.`,
                    image_url: "https://picsum.photos/seed/dark/800/450",
                    audio_url: "/audio/fear1.mp3",
                    quiz: null,
                },
                {
                    scene_no: 2,
                    text: "그때 용기의 숫자 10이 빛을 내며 나타났어요!",
                    image_url: "https://picsum.photos/seed/light/800/450",
                    audio_url: "/audio/fear2.mp3",
                    quiz: null,
                },
                {
                    scene_no: 3,
                    text: "용기를 얻으려면 문제를 풀어야 해요. 5 + 5는?",
                    image_url: "https://picsum.photos/seed/brave/800/450",
                    audio_url: "/audio/fear3.mp3",
                    quiz: {
                        type: "short_answer",
                        question: "5 + 5는?",
                        answer: "10",
                        correct_msg: "대단해요! 용기가 생겼어요!",
                        wrong_msg: "괜찮아요, 다시 해봐요!",
                    },
                },
                {
                    scene_no: 4,
                    text: `${name}이는 이제 두렵지 않아요. 수학이 용기를 주었어요!`,
                    image_url: "https://picsum.photos/seed/courage/800/450",
                    audio_url: "/audio/fear4.mp3",
                    quiz: null,
                },
                {
                    scene_no: 5,
                    text: "이제 어둠도 무섭지 않아요!",
                    image_url: "https://picsum.photos/seed/victory/800/450",
                    audio_url: "/audio/fear5.mp3",
                    quiz: null,
                },
            ],
        },
        bored: {
            story_id: storyId,
            title: `지루한 ${name}이와 신나는 숫자 게임`,
            summary: `지루함을 재미로 바꾸는 ${name}이의 수학 모험`,
            created_at: new Date().toISOString(),
            scenes: [
                {
                    scene_no: 1,
                    text: `${name}이는 오늘 정말 지루했어요. 아무것도 하기 싫었어요.`,
                    image_url: "https://picsum.photos/seed/bored1/800/450",
                    audio_url: "/audio/bored1.mp3",
                    quiz: null,
                },
                {
                    scene_no: 2,
                    text: "그런데 수학 책에서 게임 캐릭터가 튀어나왔어요!",
                    image_url: "https://picsum.photos/seed/game/800/450",
                    audio_url: "/audio/bored2.mp3",
                    quiz: null,
                },
                {
                    scene_no: 3,
                    text: "게임을 하려면 문제를 풀어야 해요. 3 × 3은?",
                    image_url: "https://picsum.photos/seed/puzzle/800/450",
                    audio_url: "/audio/bored3.mp3",
                    quiz: {
                        type: "short_answer",
                        question: "3 × 3은?",
                        answer: "9",
                        correct_msg: "완벽해요! 게임이 시작됩니다!",
                        wrong_msg: "다시 한번 계산해볼까요?",
                    },
                },
                {
                    scene_no: 4,
                    text: `${name}이는 수학이 이렇게 재미있는지 몰랐어요!`,
                    image_url: "https://picsum.photos/seed/fun/800/450",
                    audio_url: "/audio/bored4.mp3",
                    quiz: null,
                },
                {
                    scene_no: 5,
                    text: "이제 지루할 틈이 없어요!",
                    image_url: "https://picsum.photos/seed/excited/800/450",
                    audio_url: "/audio/bored5.mp3",
                    quiz: null,
                },
            ],
        },
    };

    return storyTemplates[emotion] || storyTemplates.happiness;
}

// Get mock stages for stage selection
export function getMockStages() {
    return [
        { id: "1-1-1", name: "9까지의 수", chapter: "챕터 1-1", locked: false },
        { id: "1-1-2", name: "여러가지 모양", chapter: "챕터 1-1", locked: false },
        { id: "1-1-3", name: "덧셈과 뺄셈", chapter: "챕터 1-1", locked: false },
        { id: "1-1-4", name: "비교하기", chapter: "챕터 1-1", locked: false },
        { id: "1-2-1", name: "100까지의 수", chapter: "챕터 1-2", locked: false },
        { id: "1-2-2", name: "덧셈과 뺄셈", chapter: "챕터 1-2", locked: false },
        { id: "1-2-3", name: "모양과 시각", chapter: "챕터 1-2", locked: false },
        { id: "1-2-4", name: "덧셈과 뺄셈", chapter: "챕터 1-2", locked: false },
        { id: "2-1-1", name: "세 자리 수", chapter: "챕터 2-1", locked: false },
        { id: "2-1-2", name: "여러 가지 도형", chapter: "챕터 2-1", locked: false },
        { id: "2-1-3", name: "덧셈과 뺄셈", chapter: "챕터 2-1", locked: false },
        { id: "2-1-4", name: "길이 재기", chapter: "챕터 2-1", locked: false },
        { id: "2-1-5", name: "분류하기", chapter: "챕터 2-1", locked: false },
        { id: "2-1-6", name: "곱셈", chapter: "챕터 2-1", locked: false },
        { id: "2-2-1", name: "네 자리 수", chapter: "챕터 2-2", locked: false },
        { id: "2-2-2", name: "곱셈구구", chapter: "챕터 2-2", locked: false },
        { id: "2-2-3", name: "길이 재기", chapter: "챕터 2-2", locked: false },
        { id: "2-2-4", name: "시각과 시간", chapter: "챕터 2-2", locked: false },
        { id: "2-2-5", name: "표와 그래프", chapter: "챕터 2-2", locked: false },
        { id: "2-2-6", name: "규칙 찾기", chapter: "챕터 2-2", locked: false },
    ];
}
