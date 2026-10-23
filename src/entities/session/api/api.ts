import { instance } from '@/shared/api';
import { MOCK_ME, USE_MOCKS } from './mock';

import type { Me } from '../model/types';

export const getMe = async (): Promise<Me> => {
      if (USE_MOCKS) {
        return MOCK_ME;
    }
    const response = await instance.get<Me>('/api/auth/me');

    return response.data;