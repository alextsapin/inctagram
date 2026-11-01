import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { resendVerification } from '../api/resendVerification';
import type { RegistrationResponse, ResendVerificationRequest } from '../api/types';

export const useResendVerification = (): UseMutationResult<
    RegistrationResponse,
    Error,
    ResendVerificationRequest
> => {
    return useMutation({ mutationFn: resendVerification });
};
