/* eslint-disable jsx-a11y/label-has-associated-control */
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import css from './form.module.scss';

type SignInValues = {
    email: string;
    password: string;
};

export const SignInForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInValues>();

    const onSubmit = (): void => {
        // TODO: send sign in request to API
    };

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={css.field}>
                <label htmlFor="email">Email</label>
                <Input
                    id="email"
                    type="email"
                    error={!!errors.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message:
                                'The email or password are incorrect. Try again please',
                        },
                    })}
                />
                {errors.email && (
                    <span id="email-error" className={css.error}>
                        {errors.email.message}
                    </span>
                )}
            </div>

            <div className={css.field}>
                <label htmlFor="password">Password</label>
                <Input
                    id="password"
                    type="password"
                    showPasswordToggle
                    error={!!errors.password}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                    <span id="password-error" className={css.error}>
                        {errors.password.message}
                    </span>
                )}
            </div>

            <div className={css['forgot-password']}>
                <Link href="/forgot-password">Forgot Password</Link>
            </div>

            <Button type="submit" fullWidth>
                Sign In
            </Button>

            <div className={css.redirect}>
                <span>Don&apos;t have an account?</span>
                <Link href="/sign-up">Sign Up</Link>
            </div>
        </form>
    );
};
