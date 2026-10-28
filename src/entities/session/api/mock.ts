import type { Me } from '../model/types';

// Временная заглушка для вёрстки без backend.
// Удалить этот файл и ветку USE_MOCKS в getMe, когда появится реальный API.
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

// Управляет сценарием авторизации в моках:
// true — пользователь авторизован (getMe возвращает MOCK_ME),
// false — не авторизован (getMe бросает ошибку, эмулируя 401).
export const MOCK_IS_AUTHENTICATED = true;

export const MOCK_ME: Me = {
    userId: '00000000-0000-0000-0000-000000000000',
    username: 'ivan_petrov',
    email: 'ivan@example.com',
    isVerified: false,
};
