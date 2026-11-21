import { updatePost, getMockPost } from '@/entities/post';

export const editPost = async (id: string, description: string): Promise<void> => {
    const trimmedDescription = description.trim();
    const useMock =
        process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
        (process.env.NODE_ENV === 'development' && Boolean(getMockPost(id)));

    if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
        await updatePost(id, trimmedDescription);

        return;
    }

    if (useMock) {
        await updatePost(id, trimmedDescription);
    }
};
