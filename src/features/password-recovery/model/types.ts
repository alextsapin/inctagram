// Форма Forgot Password: email, на который придёт ссылка
export type ForgotPasswordValues = {
    email: string;
};

// Тип reCAPTCHA: с галочкой (первая отправка) или невидимая (Send Link Again).
// По нему бэкенд понимает, каким секретным ключом проверять токен
export type RecaptchaType = 'checkbox' | 'invisible';

// Что отправляем на бэкенд: email из формы, токен и тип reCAPTCHA
export type RecoverPasswordRequest = {
    email: string;
    recaptchaToken: string;
    recaptchaType: RecaptchaType;
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
