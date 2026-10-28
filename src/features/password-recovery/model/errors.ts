import { isAxiosError } from 'axios';

// Коды ответов — из Swagger, POST /api/v1/auth/password-recovery и /new-password
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const TOO_MANY_REQUESTS = 429;
const SERVICE_UNAVAILABLE = 503;

// У ошибки axios код ответа лежит в error.response.status;
// если сервер не ответил совсем — response не будет
const getStatus = (error: Error): number | undefined =>
    isAxiosError(error) ? error.response?.status : undefined;

// На new-password ответ 400 значит: код из ссылки неверный, уже использован или истёк.
// Поля и совпадение паролей форма проверяет сама до отправки, поэтому другие причины 400 не ждём
export const isLinkExpiredError = (error: Error): boolean =>
    getStatus(error) === BAD_REQUEST;

// Текст ошибки под формой для остальных случаев
export const getErrorText = (error: Error): string => {
    // 403 на password-recovery: бэкенд не принял токен reCAPTCHA
    if (getStatus(error) === FORBIDDEN) {
        return 'reCAPTCHA verification failed. Please try again';
    }

    // 503 на password-recovery: Google reCAPTCHA не ответил бэкенду
    if (getStatus(error) === SERVICE_UNAVAILABLE) {
        return 'reCAPTCHA is not available. Please try again later';
    }

    if (getStatus(error) === TOO_MANY_REQUESTS) {
        return 'Too many attempts. Please try again later';
    }

    return 'Something went wrong. Please try again later';
};
