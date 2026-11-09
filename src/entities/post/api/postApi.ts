import {
    createMockPost,
    deleteMockPost,
    getMockPost,
    getMockUserPosts,
    MOCK_SIGNED_IN_AUTHOR,
    updateMockPost,
} from '../model/mock';
import type { Post, PostImage } from '../model/type';

// Получить конкретную публикацию
export const getPost = async (id: string): Promise<Post> => {
    const post = getMockPost(id);

    if (!post) {
        throw new Error(`Post with id ${id} not found`);
    }

    return post;
};

// Получить все публикации пользователя
export const getUserPosts = async (username: string): Promise<Post[]> => {
    return getMockUserPosts(username);
};

// Получить описание поста
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

// Получить изображения
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

// Фото поста
const createPostImages = (files: File[]): PostImage[] => {
    return files.map(file => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        alt: file.name,
    }));
};

// Собираем постт целиком
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

// Обновим пост
export const updatePost = async (id: string, description: string): Promise<Post> => {
    const post = updateMockPost(id, description.trim());

    if (!post) {
        throw new Error(`Post with id ${id} not found`);
    }

    return post;
};

// Удаление поста
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
