import { deletePost } from '@/entities/post';
import { instance } from '@/shared/api';

export const deletePostApi = async (id: string): Promise<void> => {
    const useMocks =
        process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
        (process.env.NEXT_PUBLIC_USE_MOCKS !== 'false' &&
            process.env.NODE_ENV === 'development');

    if (useMocks) {
        await deletePost(id);

        return;
    }

    await instance.delete(`/api/v1/post/${encodeURIComponent(id)}`);
};
