import axios, { isAxiosError } from 'axios';

import { getAccessToken } from './accessToken';
import { refreshAccessToken } from './refreshToken';

const UNAUTHORIZED = 401;

// Запросы, где 401 не значит «истёк access-токен»: неверный email или пароль при входе
// и уже завершённая сессия при выходе. Refresh для них не нужен
const NO_REFRESH_URLS = ['/api/v1/auth/login', '/api/v1/auth/logout'];

export const instance = axios.create({
    // пусто — запросы идут на тот же домен (/api/v1/...), как в кластере
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    // чтобы браузер сохранял и отправлял cookie с refresh-токеном
    withCredentials: true,
});

// Перед каждым запросом добавляем токен, если он есть
instance.interceptors.request.use(config => {
    const token = getAccessToken();

    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
});

// Ответ 401: access-токен истёк или его нет (например, после перезагрузки страницы).
// Получаем новый по refresh-токену и повторяем запрос один раз
instance.interceptors.response.use(
    response => response,
    async error => {
        // Другие ошибки (не 401) отдаём как есть
        if (
            !isAxiosError(error) ||
            error.response?.status !== UNAUTHORIZED ||
            !error.config
        ) {
            throw error;
        }

        // Вход и выход: 401 тут не про токен, отдаём ошибку как есть
        if (NO_REFRESH_URLS.includes(error.config.url ?? '')) {
            throw error;
        }

        const token = await refreshAccessToken();

        // Сессию восстановить нельзя: отдаём исходную ошибку 401
        if (!token) {
            throw error;
        }

        // Описание запроса, который упал с 401: метод, адрес, тело, заголовки.
        // Меняем в нём только токен
        const originalRequest = error.config;

        originalRequest.headers.set('Authorization', `Bearer ${token}`);

        // Отправляем тот же запрос ещё раз, уже с новым токеном.
        // Обычный axios, а не instance: если и повтор вернёт 401, этот обработчик
        // не запустится снова, и бесконечного круга не будет
        const retryResponse = await axios.request(originalRequest);

        // Этот ответ получит тот, кто делал исходный запрос (например, getMe),
        // как будто ошибки 401 и не было
        return retryResponse;
    },
);
