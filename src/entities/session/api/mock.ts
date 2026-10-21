import type { Me } from '../model/types';

// Временная заглушка для вёрстки без backend.
// Удалить этот файл и ветку USE_MOCKS в getMe, когда появится реальный API.
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const MOCK_ME: Me = {
    userId: '00000000-0000-0000-0000-000000000000',
    username: 'ivan_petrov',
    email: 'ivan@example.com',
};
