// Публичный тестовый ключ Google для reCAPTCHA v2: проверка всегда проходит.
// Нужен, чтобы виджеты работали локально без .env.local.
// Источник: https://developers.google.com/recaptcha/docs/faq
const GOOGLE_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

// У Google один ключ подходит только для одного типа капчи, поэтому ключей два.
// Настоящие ключи задаются переменными окружения на деплое.

// Тип reCAPTCHA: с галочкой или невидимая.
// По нему бэкенд понимает, каким секретным ключом проверять токен
export type RecaptchaType = 'checkbox' | 'invisible';

// Капча с галочкой «I'm not a robot»
export const RECAPTCHA_CHECKBOX_SITE_KEY =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX || GOOGLE_TEST_SITE_KEY;

// Невидимая капча: без галочки, токен через executeAsync()
export const RECAPTCHA_INVISIBLE_SITE_KEY =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE || GOOGLE_TEST_SITE_KEY;

// Токен и тип reCAPTCHA бэкенд ждёт в заголовках, а не в теле запроса
export const getRecaptchaHeaders = (
    recaptchaToken: string,
    recaptchaType: RecaptchaType,
): Record<string, string> => ({
    'X-Recaptcha-Token': recaptchaToken,
    'X-Recaptcha-Type': recaptchaType,
});
