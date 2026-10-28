import axios from 'axios';

import { setAccessToken } from './accessToken';

type RefreshResponse = {
    accessToken: string;
};

// Запрос refresh, который идёт прямо сейчас, или null, если сейчас ничего не идёт.
// Сам запрос вернёт новый токен (string) или null, если сессию восстановить нельзя.
// Пока он не закончился, остальные ждут его, а не отправляют свой:
// бэкенд завершает всю сессию, если тот же refresh-токен прислать дважды
let refreshPromise: Promise<string | null> | null = null;

// Спрашиваем у бэкенда новый access-токен. Refresh-токен лежит в cookie, браузер отправит её сам.
// Обычный axios, а не instance: иначе обработчик 401 в instance перехватывал бы и этот запрос
const requestNewToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post<RefreshResponse>('/api/v1/auth/refresh', null, {
            baseURL: process.env.NEXT_PUBLIC_API_URL ?? '', // как в instance.ts
            withCredentials: true, // чтобы браузер отправил и сохранил cookie
        });

        setAccessToken(response.data.accessToken);

        return response.data.accessToken;
    } catch {
        // Cookie нет или она устарела: пользователь не авторизован
        setAccessToken(null);

        return null;
    }
};

// Получить новый access-токен. Вернёт null, если сессию восстановить нельзя
export const refreshAccessToken = (): Promise<string | null> => {
    if (!refreshPromise) {
        refreshPromise = requestNewToken().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
};
