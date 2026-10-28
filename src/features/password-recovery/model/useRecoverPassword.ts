import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { recoverPassword } from '../api/api';

import type { RecoverPasswordRequest } from './types';

// UseMutationResult<void, Error, RecoverPasswordRequest>: при успехе ничего не возвращает,
// при ошибке Error, на вход — email и данные reCAPTCHA
export const useRecoverPassword = (): UseMutationResult<
    void,
    Error,
    RecoverPasswordRequest
> => {
    return useMutation({ mutationFn: recoverPassword });
};
