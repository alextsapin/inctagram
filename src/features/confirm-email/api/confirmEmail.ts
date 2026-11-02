import { instance } from '@/shared/api';

export const confirmEmail = async (code: string): Promise<void> => {
    await instance.post('/api/v1/auth/confirm-email', {
        code,
    });
};
