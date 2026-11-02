import { instance } from '@/shared/api';
import { getRecaptchaHeaders } from '@/shared/config';

import type { RegistrationResponse, ResendVerificationRequest } from './types';

export const resendVerification = async ({
    email,
    recaptchaToken,
}: ResendVerificationRequest): Promise<RegistrationResponse> => {
    const response = await instance.post<RegistrationResponse>(
        '/api/v1/auth/resend-verification',
        { email },
        { headers: getRecaptchaHeaders(recaptchaToken, 'invisible') },
    );

    return response.data;
};
