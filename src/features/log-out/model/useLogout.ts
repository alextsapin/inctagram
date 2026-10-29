import {
    useMutation,
    useQueryClient,
    type UseMutationResult,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { setAccessToken } from '@/shared/api/accessToken';

import { logoutApi } from '../api/api';

// UseMutationResult<Успешный ответ, Тип ошибки, Аргументы функции>
type LogoutMutationResult = UseMutationResult<void, Error, void>;

export const useLogout = (): LogoutMutationResult => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            // 1. Стираем Access Token из памяти
            setAccessToken(null);

            // 2. Полностью чистим кеш запросов (чтобы данные юзера не остались в памяти)
            queryClient.clear();

            // 3. Редирект на страницу логина
            // replace() не даст вернуться назад кнопкой "Назад" в браузере
            router.replace('/sign-in');
        },
        onError: error => {
            // Если сервер вернул ошибку (например, 500), мы всё равно можем разлогинить юзера на клиенте.
            console.error('Ошибка при выходе:', error);
        },
    });
};
