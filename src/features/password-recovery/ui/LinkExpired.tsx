'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

import illustration from '../assets/link-expired.svg';

import css from './link-expired.module.scss';

// Экран «ссылка истекла». Поля email в макете нет, а для новой ссылки нужны email и reCAPTCHA,
// поэтому кнопка ведёт на страницу Forgot Password: там пользователь запросит ссылку заново
export const LinkExpired = (): React.JSX.Element => {
    const router = useRouter();

    return (
        <div className={css.root}>
            <h1 className={css.title}>Email verification link expired</h1>
            <p className={css.text}>
                Looks like the verification link has expired. Not to worry, we can send
                the link again
            </p>
            <Button onClick={() => router.push('/forgot-password')}>Resend link</Button>

            {/* Картинка только для красоты, поэтому alt пустой: скринридер её пропустит */}
            <Image
                src={illustration}
                alt=""
                width={473}
                height={353}
                className={css.image}
            />
        </div>
    );
};
