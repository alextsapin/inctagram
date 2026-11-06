import { ForgotPasswordForm } from '@/features/password-recovery';

import css from './forgot-password.module.scss';

export const ForgotPassword = (): React.JSX.Element => {
    return (
        <main className="container">
            <div className={css.wrapper}>
                <h1 className={css.title}>Forgot Password</h1>
                <ForgotPasswordForm />
            </div>
        </main>
    );
};
