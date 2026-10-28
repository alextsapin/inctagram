import Image from 'next/image';

import github from '../assets/github.svg';
import google from '../assets/google.svg';

import css from './oauth.module.scss';

// Адрес бэкенда: пусто — тот же домен (как в shared/api/instance.ts)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// Вход и регистрация через Google или GitHub для фронта одинаковые:
// бэкенд сам создаст нового пользователя или найдёт существующего.
// Обычные ссылки <a>, а не Link и не запрос из кода: браузер должен целиком перейти
// на бэкенд, а оттуда на страницу Google или GitHub (так написано в Swagger)
export const Oauth = (): React.JSX.Element => {
    return (
        <div className={css.buttons}>
            <a
                href={`${API_URL}/api/v1/auth/google`}
                className={css.button}
                aria-label="Continue with Google"
            >
                <Image src={google} alt="" width={36} height={36} />
            </a>
            <a
                href={`${API_URL}/api/v1/auth/github`}
                className={css.button}
                aria-label="Continue with GitHub"
            >
                <Image src={github} alt="" width={36} height={36} />
            </a>
        </div>
    );
};
