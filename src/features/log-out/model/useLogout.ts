import {
    useMutation,
    useQueryClient,
    type UseMutationResult,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { setAccessToken } from '@/shared/api/';

import { logoutApi } from '../api/api';

// UseMutationResult<Успешный ответ, Тип ошибки, Аргументы функции>
type LogoutMutationResult = UseMutationResult<void, Error, void>;

export const useLogout = (): LogoutMutationResult => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const clearClientSession = (): void => {
        // 1. Стираем Access Token из памяти
        setAccessToken(null);

        // 2. Полностью чистим кеш запросов (чтобы данные юзера не остались в памяти)
        queryClient.clear();

        // 3. Редирект на страницу логина
        // replace() не даст вернуться назад кнопкой "Назад" в браузере
        router.replace('/sign-in');
    };

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            clearClientSession();
        },
        onError: error => {
            clearClientSession();
            // eslint-disable-next-line no-console
            console.error('Ошибка при выходе:', error);
        },
    });
};
