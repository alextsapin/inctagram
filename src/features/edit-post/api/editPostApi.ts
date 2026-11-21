import { updatePost } from '@/entities/post';
import { instance } from '@/shared/api';

export const editPost = async (id: string, description: string): Promise<void> => {
    const trimmedDescription = description.trim();

    if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
        await updatePost(id, trimmedDescription);

        return;
    }

    await instance.put(`/api/v1/post/${encodeURIComponent(id)}`, {
        description: trimmedDescription,
    });
};
