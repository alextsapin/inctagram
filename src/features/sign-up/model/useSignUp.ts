import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { signUp } from '../api/api';

import type { RegistrationResponse, SignUpRequest } from './types';

export const useSignUp = (): UseMutationResult<
    RegistrationResponse,
    Error,
    SignUpRequest
> => {
    return useMutation({
        mutationFn: signUp,
    });
};
