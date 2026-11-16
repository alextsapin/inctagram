import { instance } from '@/shared/api';

export const updatePost = async (id: string, description: string): Promise<void> => {
    await instance.put(`/api/v1/post/${id}`, {
        description: description.trim(),
    });
};
