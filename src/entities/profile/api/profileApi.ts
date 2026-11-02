import { MOCK_OTHER_PROFILE, MOCK_POSTS, MOCK_PROFILE } from '../mocks/profile.mock';
import type { Post, Profile } from '../model/types';

// Заглушки API. На бэкенде пока нет эндпоинтов профиля и постов,
// поэтому методы всегда возвращают mock-данные, даже без NEXT_PUBLIC_USE_MOCKS.
// Вход и данные текущего пользователя (getMe) при этом настоящие.
// Когда появятся реальные endpoints, замени тела функций на запросы к API.
// Сейчас методы синхронные (моки), при переходе на реальный API их нужно
// сделать async и вызывать через TanStack Query.

export const profileApi = {
    // TODO: заменить на GET /api/profile
    getProfile(): Profile {
        return MOCK_PROFILE;
    },

    // TODO: заменить на GET /api/profile/{username}
    // username берём из адреса, чтобы на странице было настоящее имя
    getUserProfile(username: string): Profile {
        return { ...MOCK_OTHER_PROFILE, username };
    },

    // TODO: заменить на GET /api/profile/{username}/posts
    getPosts(): Post[] {
        return MOCK_POSTS;
    },
};
