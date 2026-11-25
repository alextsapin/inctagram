// Тело PUT /api/v1/profile (UpdateProfileDto).
// Все поля необязательные: отсутствует — не меняем, null — очищаем.
// В Swagger username тоже nullable, но null бэкенд игнорирует, поэтому в типе
// оставляем string, чтобы случайно не отправить null.
// TODO(BLD-162): в Swagger у UpdateProfileDto пока нет firstName, lastName,
// dateOfBirth, country и city. Когда бэкенд их добавит, расширить тип и форму.
export type UpdateProfileDto = {
    username?: string;
    avatar?: string | null;
    description?: string | null;
};

// TODO(BLD-165): подтверждено только имя поля avatarUrl, полная
// структура ответа (обёртка, соседние поля) — нет
export type UploadAvatarResponse = {
    avatarUrl: string;
};

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
