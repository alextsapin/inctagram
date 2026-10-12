import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui';

import eyeOff from '../assets/eye-off.svg';
import eye from '../assets/eye.svg';

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

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleTogglePassword = (): void => {
        setIsPasswordVisible(prev => !prev);
    };

    const onSubmit = (): void => {
        // TODO: send sign in request to API
    };

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <label
                className={
                    errors.email ? `${css.field} ${css['field-error']}` : css.field
                }
                htmlFor="email"
            >
                Email
                <input
                    id="email"
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
                    <span className={css.error}>{errors.email.message}</span>
                )}
            </label>

            <label
                className={
                    errors.password ? `${css.field} ${css['field-error']}` : css.field
                }
                htmlFor="password"
            >
                Password
                <div className={css['password-wrapper']}>
                    <input
                        id="password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        {...register('password', { required: 'Password is required' })}
                    />
                    <button
                        type="button"
                        className={css['password-toggle']}
                        onClick={handleTogglePassword}
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        <Image
                            src={isPasswordVisible ? eyeOff : eye}
                            alt=""
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
                {errors.password && (
                    <span className={css.error}>{errors.password.message}</span>
                )}
            </label>

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
