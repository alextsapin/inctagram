import axios from 'axios';

import { getAccessToken } from './accessToken';

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
