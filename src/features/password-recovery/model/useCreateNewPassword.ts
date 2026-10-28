import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createNewPassword } from '../api/api';

import type { NewPasswordRequest } from './types';

export const useCreateNewPassword = (): UseMutationResult<
    void,
    Error,
    NewPasswordRequest
> => {
    const router = useRouter();

    return useMutation({
        mutationFn: createNewPassword,
        // Пароль сменили — отправляем на вход с новым паролем
        onSuccess: () => router.push('/sign-in'),
    });
};
