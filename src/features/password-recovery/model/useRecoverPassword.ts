import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { recoverPassword } from '../api/api';

import type { ForgotPasswordValues } from './types';

// UseMutationResult<void, Error, ForgotPasswordValues>: при успехе ничего не возвращает,
// при ошибке Error, на вход — данные формы
export const useRecoverPassword = (): UseMutationResult<
    void,
    Error,
    ForgotPasswordValues
> => {
    return useMutation({ mutationFn: recoverPassword });
};
