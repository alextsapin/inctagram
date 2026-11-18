import { instance } from '@/shared/api';

import {
    createMockPost,
    deleteMockPost,
    getMockPost,
    getMockUserPosts,
    MOCK_SIGNED_IN_AUTHOR,
    updateMockPost,
} from '../model/mock';
import type { Post, PostImage, UserPostsPage } from '../model/type';

// Get a post by ID or throw an error if it is not found

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

// Get a page of a user's posts for infinite loading (задача 12 / BLD-142).
// cursor — id последнего поста предыдущей страницы (null на первой странице).
// Тонкая обёртка над моком; при переходе на реальный API тело заменим на запрос.
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

// Extract and normalize the description from FormData
const getDescription = (formData: FormData): string => {
    const value = formData.get('description');

    if (value === null) {
        return '';
    }

    if (typeof value !== 'string') {
        throw new Error('Description must be a string');
    }

    return value.trim();
};

// Extract and validate JPEG and PNG files from FormData
const getImages = (formData: FormData): File[] => {
    const files = formData.getAll('files');

    if (files.length === 0) {
        throw new Error('At least one image is required');
    }

    if (!files.every((file): file is File => file instanceof File)) {
        throw new Error('Invalid file');
    }

    const allowedTypes = ['image/jpeg', 'image/png'];

    if (files.some(file => !allowedTypes.includes(file.type))) {
        throw new Error('Only JPEG and PNG images are allowed');
    }

    return files;
};

// Convert files into post images with temporary blob URLs
const createPostImages = (files: File[]): PostImage[] => {
    return files.map(file => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        alt: file.name,
    }));
};

// Create a post and add it to the mock store
export const createPost = async (formData: FormData): Promise<Post> => {
    const description = getDescription(formData);
    const files = getImages(formData);
    const images = createPostImages(files);

    const post: Post = {
        id: crypto.randomUUID(),
        author: MOCK_SIGNED_IN_AUTHOR,
        images,
        caption: description,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: [],
        createdAt: new Date().toISOString(),
    };

    return createMockPost(post);
};

// Update a post's description or throw an error if the post is not found
export const updatePost = async (id: string, description: string): Promise<Post> => {
    const post = updateMockPost(id, description.trim());

    if (!post) {
        throw new Error(`Post with id ${id} not found`);
    }

    return post;
};

// Delete a post and release the blob URLs created for its images
export const deletePost = async (id: string): Promise<void> => {
    const post = getMockPost(id);

    if (!post) {
        throw new Error(`Post with id ${id} not found`);
    }

    deleteMockPost(id);

    post.images.forEach(image => {
        if (image.url.startsWith('blob:')) {
            URL.revokeObjectURL(image.url);
        }
    });
};
