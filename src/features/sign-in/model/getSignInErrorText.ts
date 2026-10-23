import { isAxiosError } from 'axios';

// Коды ответов — из Swagger, POST /api/auth/login
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const TOO_MANY_REQUESTS = 429;

export const getSignInErrorText = (error: Error): string => {
    // у ошибки axios код ответа лежит в error.response.status;
    // если сервер не ответил совсем — response не будет
    const status = isAxiosError(error) ? error.response?.status : undefined;

    if (status === BAD_REQUEST || status === UNAUTHORIZED) {
        return 'The email or password are incorrect. Try again please';
    }

    if (status === FORBIDDEN) {
        return 'Your email is not confirmed. Please check your email';
    }

    if (status === TOO_MANY_REQUESTS) {
        return 'Too many attempts. Please try again later';
    }

    return 'Something went wrong. Please try again later';
};
