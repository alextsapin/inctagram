import { instance } from '@/shared/api';

import type { Post, UserPostsPage } from '../model/type';

// Типы ответа и toPost экспортируются для postApi.server.ts: серверные функции
// возвращают посты в том же виде, что и клиентские
export type PostWithAuthorResponseDto = {
    id: string;
    description: string;
    previewUrl: string | null;
    photos: {
        id: number;
        url: string;
    }[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
};

export type PostsResponseDto = {
    items: PostWithAuthorResponseDto[];
    nextCursor: string | null;
};

export const toPost = (dto: PostWithAuthorResponseDto): Post => ({
    id: dto.id,
    author: {
        id: dto.author.id,
        username: dto.author.username,
        avatarUrl: dto.author.avatarUrl ?? '/profile/avatar.png',
    },
    images: dto.photos.map(photo => ({
        id: String(photo.id),
        url: photo.url,
    })),
    previewUrl: dto.previewUrl,
    caption: dto.description,
    likesCount: dto.likesCount,
    commentsCount: dto.commentsCount,
    createdAt: dto.createdAt,
    isLiked: false,
    isSaved: false,
    likedBy: [],
});

export const getPost = async (id: string): Promise<Post> => {
    const { data } = await instance.get<PostWithAuthorResponseDto>(
        `/api/v1/post/${encodeURIComponent(id)}`,
    );

    return toPost(data);
};

// Загружает страницу постов пользователя из API для бесконечной прокрутки.
// cursor — ID последнего поста предыдущей страницы; null запрашивает первую страницу.
// nextCursor из ответа используется для следующего запроса; null означает конец списка.
export const getUserPostsPage = async (
    userId: string,
    cursor: string | null,
): Promise<UserPostsPage> => {
    const { data } = await instance.get<PostsResponseDto>(
        `/api/v1/${encodeURIComponent(userId)}/posts`,
        {
            params: cursor ? { cursor } : undefined,
        },
    );

    return {
        posts: data.items.map(toPost),
        nextCursor: data.nextCursor,
    };
};

// Create post
export const createPost = async (formData: FormData): Promise<void> => {
    await instance.post('/api/v1/post', formData);
};

// Update a post's description. Only its author can update it.
export const updatePost = async (id: string, description: string): Promise<void> => {
    await instance.put(`/api/v1/post/${encodeURIComponent(id)}`, {
        description: description.trim(),
    });
};

// Delete a post via API. Only its author can delete it.
export const deletePost = async (id: string): Promise<void> => {
    await instance.delete(`/api/v1/post/${encodeURIComponent(id)}`);
};
