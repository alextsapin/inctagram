import {
    MOCK_SIGNED_IN_AUTHOR,
    createMockPost,
    deleteMockPost,
    getMockPost,
    getMockUserPosts,
    updateMockPost,
} from '../model/mock';
import type { Post, PostImage } from '../model/type';

// The backend routes and response contracts have not been agreed yet.
// Always use in-memory mocks until the API is ready, including in production builds.
// Keep this boundary async so TanStack Query consumers do not need to change later.
export const getPost = async (id: string): Promise<Post> => {
    const post = getMockPost(id);

    if (!post) {
        throw new Error(`Post not found: ${id}`);
    }

    return structuredClone(post);
};

export const getUserPosts = async (username: string): Promise<Post[]> =>
    getMockUserPosts(username).map(post => structuredClone(post));

// FormData convention for the mock adapter:
// - description: text (caption is supported for existing UI integrations)
// - files: one or more final, cropped/filtered image files
export const createPost = async (formData: FormData): Promise<Post> => {
    const files = formData
        .getAll('files')
        .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
        throw new Error('At least one image file is required to create a post');
    }

    const description = formData.get('description') ?? formData.get('caption');
    const id = `mock-post-${crypto.randomUUID()}`;
    const images: PostImage[] = files.map((file, index) => {
        const url = URL.createObjectURL(file);

        return {
            id: `${id}-image-${index}`,
            url,
            previewUrl: url,
            fullUrl: url,
            alt: file.name,
        };
    });
    const post: Post = {
        id,
        author: MOCK_SIGNED_IN_AUTHOR,
        images,
        caption: typeof description === 'string' ? description : '',
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: [],
        createdAt: new Date().toISOString(),
    };

    return structuredClone(createMockPost(post));
};

export const updatePost = async (id: string, description: string): Promise<Post> => {
    const updated = updateMockPost(id, description);

    if (!updated) {
        throw new Error(`Post not found: ${id}`);
    }

    return structuredClone(updated);
};

export const deletePost = async (id: string): Promise<void> => {
    const post = getMockPost(id);

    if (!post || !deleteMockPost(id)) {
        throw new Error(`Post not found: ${id}`);
    }

    // Release temporary browser URLs generated during mock uploads.
    post.images.forEach(image => {
        if (image.url.startsWith('blob:')) {
            URL.revokeObjectURL(image.url);
        }
    });
};
