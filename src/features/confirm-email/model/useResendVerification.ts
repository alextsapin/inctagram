import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { resendVerification } from '../api/resendVerification';
import type { RegistrationResponse } from '../api/types';

export const useResendVerification = (): UseMutationResult<
    RegistrationResponse,
    Error,
    string
> => {
    return useMutation({ mutationFn: resendVerification });
};
