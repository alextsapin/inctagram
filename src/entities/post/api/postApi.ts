import { instance } from '@/shared/api';

import { getMockPost, getMockUserPosts, updateMockPost } from '../model/mock';
import type { Post, UserPostsPage } from '../model/type';

type PostWithAuthorResponseDto = {
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

type PostsResponseDto = {
    items: PostWithAuthorResponseDto[];
    nextCursor: string | null;
};

const toPost = (dto: PostWithAuthorResponseDto): Post => ({
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
    const mockPost = getMockPost(id);

    // Сохраняем возможность открывать моковые публикации
    // во время локальной разработки.
    if (
        process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
        (process.env.NODE_ENV === 'development' && mockPost)
    ) {
        if (!mockPost) {
            throw new Error(`Post with id ${id} not found`);
        }

        return mockPost;
    }

    const { data } = await instance.get<PostWithAuthorResponseDto>(
        `/api/v1/post/${encodeURIComponent(id)}`,
    );

    return toPost(data);
};

// Get a user's posts sorted from newest to oldest
export const getUserPosts = async (userId: string): Promise<Post[]> => {
    return getMockUserPosts(userId);
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

// Update a post's description or throw an error if the post is not found
export const updatePost = async (id: string, description: string): Promise<Post> => {
    const post = updateMockPost(id, description.trim());

    if (!post) {
        throw new Error(`Post with id ${id} not found`);
    }

    return post;
};

// Delete a post via API. Only its author can delete it.
export const deletePost = async (id: string): Promise<void> => {
    await instance.delete(`/api/v1/post/${encodeURIComponent(id)}`);
};
