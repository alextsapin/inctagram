'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

import illustration from '../assets/oauth-failure.svg';

import css from './oauth-failure.module.scss';

// Сюда бэкенд возвращает пользователя, если вход через Google или GitHub не удался
// (в адресе /auth/oauth/failure?error=...). Коды ошибок бэкенд ещё не определил,
// поэтому пока текст один для всех случаев. Вид как у экрана Link expired
export const OAuthFailure = (): React.JSX.Element => {
    const router = useRouter();

    return (
        <main className="container">
            <div className={css.root}>
                <h1 className={css.title}>Sign in failed</h1>
                <p className={css.text}>
                    Could not sign in with Google or GitHub. Please try again
                </p>
                <Button onClick={() => router.push('/sign-in')}>Back to Sign In</Button>

                {/* Картинка только для красоты, поэтому alt пустой: скринридер её пропустит */}
                <Image
                    src={illustration}
                    alt=""
                    width={400}
                    height={400}
                    className={css.image}
                />
            </div>
        </main>
    );
};
