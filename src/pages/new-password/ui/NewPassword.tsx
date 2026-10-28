'use client';

import { useState } from 'react';

import { LinkExpired, NewPasswordForm } from '@/features/password-recovery';

import css from './new-password.module.scss';

type NewPasswordProps = {
    code: string; // код из ссылки в письме (?code=...); пустой, если в ссылке его нет
};

export const NewPassword = ({ code }: NewPasswordProps): React.JSX.Element => {
    // Без кода задать пароль нельзя, поэтому сразу показываем экран «ссылка истекла»
    const [isLinkExpired, setIsLinkExpired] = useState(code === '');

    if (isLinkExpired) {
        return (
            <main className="container">
                <LinkExpired />
            </main>
        );
    }

    return (
        <main className="container">
            <div className={css.wrapper}>
                <h1 className={css.title}>Create New Password</h1>
                <NewPasswordForm
                    code={code}
                    onLinkExpired={() => setIsLinkExpired(true)}
                />
            </div>
        </main>
    );
};
