import type ReCAPTCHA from 'react-google-recaptcha';

// Сколько ждём токен невидимой reCAPTCHA: 60 секунд.
// Если Google показал окно с картинками, а его закрыли, не пройдя проверку,
// библиотека ждёт ответа бесконечно, и кнопка формы зависает
const RECAPTCHA_TIMEOUT_MS = 60_000;

// Просит у невидимой reCAPTCHA новый токен.
// Возвращает null, если токена нет: Google не ответил, вернул ошибку
// или окно проверки закрыли. Тогда форма показывает ошибку и снова разрешает отправку
export const executeRecaptcha = async (
    recaptcha: ReCAPTCHA | null,
): Promise<string | null> => {
    if (!recaptcha) {
        return null;
    }

    // Токен одноразовый: сбрасываем прошлый, чтобы получить новый
    recaptcha.reset();

    let timerId: ReturnType<typeof setTimeout> | undefined;

    const timeout = new Promise<null>(resolve => {
        timerId = setTimeout(() => resolve(null), RECAPTCHA_TIMEOUT_MS);
    });

    try {
        // Что наступит раньше: токен от Google или конец ожидания
        const token = await Promise.race([recaptcha.executeAsync(), timeout]);

        if (!token) {
            // Закрываем окно проверки, если оно ещё открыто
            recaptcha.reset();
        }

        return token;
    } catch {
        recaptcha.reset();

        return null;
    } finally {
        clearTimeout(timerId);
    }
};
