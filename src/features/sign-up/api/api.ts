import { instance } from '@/shared/api';

import type { RegistrationResponse, SignUpValues } from '../model/types';

export const signUp = async (values: SignUpValues): Promise<RegistrationResponse> => {
    const response = await instance.post<RegistrationResponse>(
        '/api/v1/auth/registration',
        values,
    );

    return response.data;
};
