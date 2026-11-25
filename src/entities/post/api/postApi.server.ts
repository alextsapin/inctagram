import 'server-only';

import { cache } from 'react';

import { getFromServer, isNotFoundError } from '@/shared/api/server';

import type { Post, UserPostsPage } from '../model/type';

import { toPost, type PostsResponseDto, type PostWithAuthorResponseDto } from './postApi';

// Первая страница постов автора для серверной загрузки: до 8 постов, новые сверху.
// Вид ответа такой же, как у getUserPostsPage, иначе сетка постов в браузере
// не узнает эти данные. Если бэкенд не ответил, выбрасывает ошибку
export const getUserPostsPageOnServer = cache(
    async (userId: string): Promise<UserPostsPage> => {
        const data = await getFromServer<PostsResponseDto>(
            `/api/v1/${encodeURIComponent(userId)}/posts`,
        );

        return { posts: data.items.map(toPost), nextCursor: data.nextCursor };
    },
);

// Один пост по id для серверной загрузки. null — такого поста нет.
// Если бэкенд не ответил, выбрасывает ошибку: тогда пост загрузит браузер
export const getPostOnServer = cache(async (id: string): Promise<Post | null> => {
    try {
        const data = await getFromServer<PostWithAuthorResponseDto>(
            `/api/v1/post/${encodeURIComponent(id)}`,
        );

        return toPost(data);
    } catch (error) {
        if (isNotFoundError(error)) return null;

        throw error;
    }
});
