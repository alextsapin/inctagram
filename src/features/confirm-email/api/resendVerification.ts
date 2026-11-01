import { instance } from '@/shared/api';

import type { RegistrationResponse } from './types';

export const resendVerification = async (
    email: string,
): Promise<RegistrationResponse> => {
    const response = await instance.post<RegistrationResponse>(
        '/api/v1/auth/resend-verification',
        { email },
    );

    return response.data;
};
