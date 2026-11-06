// [!-~] — все видимые символы от «!» до «~» по таблице ASCII:
// цифры, латинские буквы и все знаки препинания. Пробела и кириллицы там нет
const VISIBLE_CHARACTERS = /^[!-~]+$/;

// Бэкенд (Swagger: RegistrationDto и NewPasswordDto) не принимает ` и |,
// хотя они входят в диапазон [!-~]
const FORBIDDEN_CHARACTERS = /[`|]/;

// Текст для пользователя, как в Swagger
export const PASSWORD_ERROR =
    'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { } ~';

// Пароль подходит, если в нём только разрешённые символы
// и есть хотя бы одна цифра, одна строчная и одна заглавная латинская буква
export const isPasswordValid = (password: string): boolean =>
    VISIBLE_CHARACTERS.test(password) &&
    !FORBIDDEN_CHARACTERS.test(password) &&
    /[0-9]/.test(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password);

export const validatePassword = (value: string): true | string =>
    isPasswordValid(value) || PASSWORD_ERROR;
