import { MOCK_POSTS, MOCK_PROFILE } from '../mocks/profile.mock';
import type { Post, Profile } from '../model/types';

// Заглушки API. Когда появятся реальные endpoints, замени тела функций
// на fetch-вызовы к API и удали USE_MOCKS / mock-данные в одном месте.
// Сейчас методы синхронные (моки), при переходе на реальный API их нужно
// сделать async и вызывать через TanStack Query.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const profileApi = {
    // TODO: заменить на GET /api/profile
    getProfile(): Profile {
        if (USE_MOCKS) {
            return MOCK_PROFILE;
        }

        throw new Error('Profile API is not implemented yet');
    },

    // TODO: заменить на GET /api/profile/{username}
    getUserProfile(username: string): Profile {
        if (USE_MOCKS) {
            return { ...MOCK_PROFILE, username };
        }

        throw new Error('User profile API is not implemented yet');
    },

    // TODO: заменить на GET /api/profile/{username}/posts
    getPosts(): Post[] {
        if (USE_MOCKS) {
            return MOCK_POSTS;
        }

        throw new Error('Posts API is not implemented yet');
    },
};
