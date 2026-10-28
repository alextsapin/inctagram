import { isAxiosError } from 'axios';

const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const CONFLICT = 409;
const TOO_MANY_REQUESTS = 429;

export const getSignUpErrorText = (error: Error): string => {
    const status = isAxiosError(error) ? error.response?.status : undefined;

    switch (status) {
        case BAD_REQUEST:
            return 'Invalid registration data. Please check your fields.';

        case FORBIDDEN:
            return 'Verification failed. Please try again.';

        case CONFLICT:
            return 'This username or email is already registered.';

        case TOO_MANY_REQUESTS:
            return 'Too many attempts. Please try again later.';

        default:
            return 'Something went wrong. Please try again later.';
    }
};
