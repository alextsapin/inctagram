import { isAxiosError } from 'axios';

import { instance } from '@/shared/api';

const TOO_MANY_REQUESTS = 429;
const UNAUTHORIZED = 401;

export const logoutApi = async (): Promise<void> => {
    try {
        // Если сервер вернет 204, мы просто выйдем из функции (успех)
        await instance.post('/api/v1/auth/logout');
    } catch (error) {
        // Ошибка-  статус был 4xx или 5xx
        if (isAxiosError(error)) {
            const status = error.response?.status;

            // 401 - Токен уже протух. Для нас это тоже успех.
            // Юзер и так не авторизован, просто выходим без ошибки.
            if (status === UNAUTHORIZED) {
                return;
            }

            // 429 - Слишком много попыток
            if (status === TOO_MANY_REQUESTS) {
                throw new Error('Too many requests. Please try again later.');
            }
        }

        // Все остальные ошибки — ошибка сервера
        throw error;
    }
};
