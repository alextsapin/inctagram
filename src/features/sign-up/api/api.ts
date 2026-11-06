import { instance } from '@/shared/api';
import { getRecaptchaHeaders } from '@/shared/config';

import type { RegistrationResponse, SignUpRequest } from '../model/types';

export const signUp = async ({
    recaptchaToken,
    ...values
}: SignUpRequest): Promise<RegistrationResponse> => {
    const response = await instance.post<RegistrationResponse>(
        '/api/v1/auth/registration',
        {
            ...values,
            termsAccepted: Boolean(values.termsAccepted),
        },
        {
            headers: getRecaptchaHeaders(recaptchaToken, 'invisible'),
        },
    );

    return response.data;
};
