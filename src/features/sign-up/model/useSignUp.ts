/* eslint-disable prettier/prettier */
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { signUp } from '../api/api';

import type { RegistrationResponse, SignUpValues } from './types';

export const useSignUp = (): UseMutationResult<RegistrationResponse, Error, SignUpValues> => {
    return useMutation({
        mutationFn: signUp,
    });
};
