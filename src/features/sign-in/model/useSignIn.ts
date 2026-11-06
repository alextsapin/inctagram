import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getMe, type Me } from '@/entities/session';
import { setAccessToken } from '@/shared/api';

import { signIn } from '../api/api';

import type { SignInValues } from './types';

export const useSignIn = (): UseMutationResult<Me, Error, SignInValues> => {
    // UseMutationResult<Me, Error, SignInValues> — что возвращает хук: при успехе Me, при ошибке Error, на вход — данные формы.
    const router = useRouter();

    return useMutation({
        mutationFn: async (values: SignInValues) => {
            const { accessToken } = await signIn(values); // 1. логинимся

            setAccessToken(accessToken); // 2. запоминаем токен

            return getMe(); // 3. узнаём username
        },
        onSuccess: me => {
            router.push(`/profile/${me.username}`); // 4. переходим в профиль
        },
    });
};
