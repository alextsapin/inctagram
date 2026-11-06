import { instance } from '@/shared/api';

import type { Me } from '../model/types';

import { MOCK_ME, USE_MOCKS } from './mock';

export const getMe = async (): Promise<Me> => {
    if (USE_MOCKS) {
        if (MOCK_ME === null) {
            throw new Error('Not authenticated');
        }

        return MOCK_ME;
    }

    const response = await instance.get<Me>('/api/v1/auth/me');

    return response.data;
};
