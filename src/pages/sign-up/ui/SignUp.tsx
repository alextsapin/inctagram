import { Oauth } from '@/features/oauth';
import { SignUpForm } from '@/features/sign-up';
import { Header } from '@/widgets/header';

import css from './sign-up.module.scss';

export const SignUp = (): React.JSX.Element => {
    return (
        <>
            <Header showAuthLinks={false} />
            <main className="container">
                <div className={css.wrapper}>
                    <h1 className={css.title}>Sign Up</h1>
                    <Oauth />
                    <SignUpForm />
                </div>
            </main>
        </>
    );
};
