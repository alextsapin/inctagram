// Заглушки API. На бэкенде пока нет эндпоинтов профиля и постов,
// поэтому методы всегда возвращают mock-данные, даже без NEXT_PUBLIC_USE_MOCKS.
// Вход и данные текущего пользователя (getMe) при этом настоящие.
// Когда появятся реальные endpoints, замени тела функций на запросы к API.
// Сейчас методы синхронные (моки), при переходе на реальный API их нужно
// сделать async и вызывать через TanStack Query.

import { MOCK_POSTS } from '../model/mock';
import { Post } from '../model/type';

export const postApi = {
    // TODO: заменить на GET
    getPost(): Post[] {
        return MOCK_POSTS;
    },

    // TODO: заменить на GET
    getUserPost(id: string): Post | null {
        return MOCK_POSTS.find(post => post.id === id) || null;
    },
};
