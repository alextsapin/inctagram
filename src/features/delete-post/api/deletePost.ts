import { deleteMockPost, deletePost } from '@/entities/post';

export const deletePostApi = async (id: string): Promise<void> => {
    const useMocks =
        process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
        (process.env.NEXT_PUBLIC_USE_MOCKS !== 'false' &&
            process.env.NODE_ENV === 'development');

    if (useMocks) {
        deleteMockPost(id);

        return;
    }

    await deletePost(id);
};
