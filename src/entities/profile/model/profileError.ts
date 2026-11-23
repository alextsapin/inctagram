import { isAxiosError } from 'axios';

// Коды ответов — из Swagger, PUT /api/v1/profile
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const CONFLICT = 409;

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again later';
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
// каждое невалидное поле, чтобы форма разложила их по своим полям. Для 403,
// 409 и остальных — одну общую ошибку (409 привязан к полю username).
export const normalizeProfileError = (error: unknown): ProfileError[] => {
    if (!isAxiosError(error)) {
        return [{ message: DEFAULT_ERROR_MESSAGE }];
    }

    const status = error.response?.status;

    if (status === BAD_REQUEST) {
        const data = error.response?.data as ErrorsMessagesDto | undefined;
        const fieldErrors = data?.errorsMessages ?? [];

        if (fieldErrors.length > 0) {
            return fieldErrors.map(({ field, message }) => ({ field, message }));
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
