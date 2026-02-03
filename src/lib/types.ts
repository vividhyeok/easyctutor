export interface Chapter {
    id: string; // "0", "1", ...
    title: string; // "0장. 시작하기"
    slug: string; // "0" (for routing)
    content: string; // Markdown content
}

export interface Section {
    id: string; // "8-6-jaju-haneun-silsu"
    title: string; // "8-6. 자주 하는 실수 모음"
    level: number; // 2
}
