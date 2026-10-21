import { instance } from '@/shared/api';

import type { Me } from '../model/types';

export const getMe = async (): Promise<Me> => {
    const response = await instance.get<Me>('/api/auth/me');

    return response.data;
};
