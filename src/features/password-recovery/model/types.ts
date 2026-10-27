// Форма Forgot Password: email, на который придёт ссылка
export type ForgotPasswordValues = {
    email: string;
};

// Форма Create New Password
export type NewPasswordValues = {
    newPassword: string;
    passwordConfirmation: string;
};

// Что отправляем на бэкенд: пароли из формы и код из ссылки в письме
export type NewPasswordRequest = {
    newPassword: string;
    passwordConfirmation: string;
    code: string;
};
