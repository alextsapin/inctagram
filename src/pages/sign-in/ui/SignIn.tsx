'use client';

import { Oauth } from '@/features/oauth';
import { SignInForm } from '@/features/sign-in';

import css from './sign-in.module.scss';

export const SignIn = (): React.JSX.Element => {
    return (
        <main className="container">
            <div className={css.wrapper}>
                <h1 className={css.title}>Sign In</h1>
                <Oauth />
                <SignInForm />
            </div>
        </main>
    );
};
