import { Oauth } from '@/features/oauth';
import { SignUpForm } from '@/features/sign-up';

import css from './sign-up.module.scss';

export const SignUp = (): React.JSX.Element => {
    return (
        <main className="container">
            <div className={css.wrapper}>
                <h1 className={css.title}>Sign Up</h1>
                <Oauth />
                <SignUpForm />
            </div>
        </main>
    );
};
