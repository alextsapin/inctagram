// Ответ GET /api/v1/{username}/profile (ProfileResponseDto).
export type Profile = {
    uid: string;
    username: string;
    avatar: string | null;
    // Заглушка на бэкенде: содержит только uid самого пользователя.
    subscriptions: string[];
    // Заглушка на бэкенде: всегда 1 (сам пользователь).
    followers: number;
    // Количество созданных постов.
    publications: number;
    // «About me».
    description: string | null;
};
