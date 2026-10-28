// Публичный тестовый ключ Google для reCAPTCHA v2: галочка всегда проходит.
// Нужен, чтобы виджет работал локально без .env.local.
// Источник: https://developers.google.com/recaptcha/docs/faq
const GOOGLE_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

// Настоящий ключ задаётся переменной окружения на деплое (задача BLD-87)
export const RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || GOOGLE_TEST_SITE_KEY;
