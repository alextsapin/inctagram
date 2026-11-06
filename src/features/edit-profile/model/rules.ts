import type { RegisterOptions } from 'react-hook-form';

import { getAge } from '../lib/getAge';

import type { EditProfileValues } from './types';

// Правила username такие же, как при регистрации (RegistrationDto в Swagger)
const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[0-9A-Za-z_-]+$/;

const NAME_MAX_LENGTH = 50;
// Только буквы: латиница и кириллица
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё]+$/;

const ABOUT_ME_MAX_LENGTH = 200;

const MIN_AGE = 13;

export const usernameRules: RegisterOptions<EditProfileValues, 'username'> = {
    required: 'Username is required',
    minLength: {
        value: USERNAME_MIN_LENGTH,
        message: `Minimum number of characters ${USERNAME_MIN_LENGTH}`,
    },
    maxLength: {
        value: USERNAME_MAX_LENGTH,
        message: `Maximum number of characters ${USERNAME_MAX_LENGTH}`,
    },
    pattern: {
        value: USERNAME_PATTERN,
        message: 'Only Latin letters, numbers, _ and - are allowed',
    },
};

// Одинаковые правила для First Name и Last Name, отличается только текст ошибки
const getNameRules = (
    label: string,
): RegisterOptions<EditProfileValues, 'firstName' | 'lastName'> => ({
    required: `${label} is required`,
    maxLength: {
        value: NAME_MAX_LENGTH,
        message: `Maximum number of characters ${NAME_MAX_LENGTH}`,
    },
    pattern: {
        value: NAME_PATTERN,
        message: 'Only letters are allowed',
    },
});

export const firstNameRules = getNameRules('First Name');
export const lastNameRules = getNameRules('Last Name');

export const dateOfBirthRules: RegisterOptions<EditProfileValues, 'dateOfBirth'> = {
    // Дата необязательная: пустое поле считаем правильным
    validate: date =>
        !date ||
        getAge(date) >= MIN_AGE ||
        `A user under ${MIN_AGE} cannot create a profile.`,
};

export const aboutMeRules: RegisterOptions<EditProfileValues, 'aboutMe'> = {
    maxLength: {
        value: ABOUT_ME_MAX_LENGTH,
        message: `Maximum number of characters ${ABOUT_ME_MAX_LENGTH}`,
    },
};
