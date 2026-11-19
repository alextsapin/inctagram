/* eslint-disable no-console */
import { isAxiosError } from 'axios';

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const DEFAULT_ERROR_TEXT = 'Something went wrong. Please try again later';

export type FieldErrorDto = { message: string; field: string };
export type ErrorsMessagesDto = { errorsMessages: FieldErrorDto[] };
export type DeletePostErrorInfo = { text: string; isAlreadyDeleted: boolean };

export const getDeletePostError = (error: unknown): DeletePostErrorInfo => {
    if (!isAxiosError(error)) {
        console.error('[deletePost] non-Axios error:', error);

        return { text: DEFAULT_ERROR_TEXT, isAlreadyDeleted: false };
    }

    const status = error.response?.status;

    switch (status) {
        case NOT_FOUND:
            return { text: 'This post has already been deleted', isAlreadyDeleted: true }; // 404 «Post not found» — пост уже удалён

        case BAD_REQUEST: {
            const data = error.response?.data as ErrorsMessagesDto | undefined;

            console.error('[deletePost] 400 Invalid UUID', {
                url: error.config?.url,
                errors: data?.errorsMessages,
            });

            return { text: DEFAULT_ERROR_TEXT, isAlreadyDeleted: false };
        }
        case UNAUTHORIZED:
            return {
                text: 'Your session has expired. Please sign in again', // 401 «Unauthorized» — access token истёк.
                isAlreadyDeleted: false,
            };

        case FORBIDDEN:
            return {
                text: 'You can only delete your own posts', // 403 «Author only»
                isAlreadyDeleted: false,
            };

        default:
            return { text: DEFAULT_ERROR_TEXT, isAlreadyDeleted: false };
        // Всё остальное — сетевые ошибки (нет соединения), таймауты, 500 и т.д.
    }
};
