import { updatePost } from '@/entities/post';
import { instance } from '@/shared/api';

export const editPost = async (id: string, description: string): Promise<void> => {
    const trimmedDescription = description.trim();

    if (
        process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
        // || process.env.NODE_ENV === 'development'
    ) {
        await updatePost(id, trimmedDescription);

        return;
    }

    await instance.put(`/api/v1/post/${id}`, {
        description: trimmedDescription,
    });
};
