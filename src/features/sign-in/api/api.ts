import { instance } from '@/shared/api';

import type { LoginResponse, SignInValues } from '../model/types';

export const signIn = async (values: SignInValues): Promise<LoginResponse> => {
    const response = await instance.post<LoginResponse>('/api/v1/auth/login', values);

    return response.data;
};
