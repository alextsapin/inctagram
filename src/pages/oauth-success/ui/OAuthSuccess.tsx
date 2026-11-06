'use client';

import { useFinishOAuthSignIn } from '@/features/oauth';

import css from './oauth-success.module.scss';

// Сюда бэкенд возвращает пользователя после входа через Google или GitHub.
// Страница видна только пару секунд, пока не перейдём в профиль
export const OAuthSuccess = (): React.JSX.Element => {
    useFinishOAuthSignIn();

    return (
        <main className="container">
            <p className={css.text} role="status">
                Signing in…
            </p>
        </main>
    );
};
