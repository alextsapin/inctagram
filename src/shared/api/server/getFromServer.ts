import 'server-only';

import { requestServerApi } from './requestServerApi';

// Сколько ждём бэкенд. Страница отдаётся пользователю только после ответа,
// поэтому долго ждать нельзя: если бэкенд не успел, данные загрузит браузер
const TIMEOUT_MS = 5000;

const BAD_REQUEST = 400;
const NOT_FOUND = 404;

// Бэкенд ответил ошибкой. Код ответа нужен, чтобы отличить «такого нет» от сбоя
export class ServerApiError extends Error {
    status: number;

    constructor(status: number) {
        super(`Backend responded with ${status}`);
        this.name = 'ServerApiError';
        this.status = status;
    }
}

// «Такого профиля или поста нет». Бэкенд отвечает 404, а на кривой username
// или id не в формате UUID отвечает 400: это тоже значит, что такого нет
export const isNotFoundError = (error: unknown): boolean =>
    error instanceof ServerApiError &&
    (error.status === NOT_FOUND || error.status === BAD_REQUEST);

// GET-запрос к бэкенду с сервера Next. path пишем как в Swagger: /api/v1/...
// Токен не передаём: все запросы для серверной загрузки страниц публичные.
// Сертификат бэкенда проверяет requestServerApi
export const getFromServer = async <T>(path: string): Promise<T> => {
    const apiUrl = process.env.SERVER_API_URL;

    if (!apiUrl) {
        throw new Error('SERVER_API_URL is not set');
    }

    const response = await requestServerApi(new URL(path, apiUrl), {
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new ServerApiError(response.status);
    }

    // requestServerApi отдаёт тело ответа байтами (Buffer), а не готовым объектом:
    // превращаем байты в текст и разбираем JSON, как в getMainPageData
    return JSON.parse(response.body.toString('utf8')) as T;
};
