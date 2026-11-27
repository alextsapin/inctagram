import { isAxiosError } from 'axios';

// Коды ответов — из Swagger, PUT /api/v1/profile
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const CONFLICT = 409;

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again later';
const INVALID_VALUE_MESSAGE = 'Invalid value';
const EMAIL_NOT_CONFIRMED_MESSAGE =
    'Your email is not confirmed. Please check your email';
const USERNAME_TAKEN_MESSAGE = 'This username is already taken';

// ErrorsMessagesDto / FieldErrorDto из Swagger: 400 приходит списком ошибок полей.
type FieldErrorDto = { message: string; field: string };
type ErrorsMessagesDto = { errorsMessages: FieldErrorDto[] };

export type ProfileError = {
    field?: string;
    message: string;
};

// Приводит ошибку axios к понятному виду. Для 400 возвращает по элементу на
// каждое невалидное поле, чтобы форма разложила их по своим полям. Текст от
// сервера не используем: финальные формулировки по полям задаёт задача 7.
// Для 403, 409 и остальных — одну общую ошибку (409 привязан к полю username).
export const normalizeProfileError = (error: unknown): ProfileError[] => {
    if (!isAxiosError(error)) {
        return [{ message: DEFAULT_ERROR_MESSAGE }];
    }

    const status = error.response?.status;

    if (status === BAD_REQUEST) {
        const data = error.response?.data as ErrorsMessagesDto | undefined;
        const fieldErrors = data?.errorsMessages ?? [];

        if (fieldErrors.length > 0) {
            return fieldErrors.map(({ field }) => ({
                field,
                message: INVALID_VALUE_MESSAGE,
            }));
        }

        return [{ message: DEFAULT_ERROR_MESSAGE }];
    }

    if (status === FORBIDDEN) {
        return [{ message: EMAIL_NOT_CONFIRMED_MESSAGE }];
    }

    if (status === CONFLICT) {
        return [{ field: 'username', message: USERNAME_TAKEN_MESSAGE }];
    }

    return [{ message: DEFAULT_ERROR_MESSAGE }];
};

// Коды ответов — из сообщения бэкенда от 24.11.2026 (POST аватара).
// TODO(BLD-165): коды и их смысл не подтверждены Swagger'ом — уточнить
// вместе с финальным путём ручки.
const PAYLOAD_TOO_LARGE = 413;

const AVATAR_TOO_LARGE_MESSAGE = 'Photo size must be less than 1 MB!';

// Приводит ошибку загрузки аватара к одной строке. В отличие от
// normalizeProfileError, полей у этой формы нет: раскладывать ошибку по
// полям некуда, поэтому возвращаем текст.
export const normalizeAvatarUploadError = (error: unknown): string => {
    if (!isAxiosError(error)) {
        return DEFAULT_ERROR_MESSAGE;
    }

    const status = error.response?.status;

    // 413 — файл больше лимита
    if (status === PAYLOAD_TOO_LARGE) {
        return AVATAR_TOO_LARGE_MESSAGE;
    }

    // 403 — почта не подтверждена
    if (status === FORBIDDEN) {
        return EMAIL_NOT_CONFIRMED_MESSAGE;
    }

    return DEFAULT_ERROR_MESSAGE;
};
