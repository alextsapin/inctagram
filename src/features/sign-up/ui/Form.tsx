/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable lines-around-directive */
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';

import css from './form.module.scss';

type SignUpValues = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    agree: boolean;
};

export const SignUpForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpValues>({
        mode: 'onBlur',
    });

    const onSubmit = (data: SignUpValues): void => {
        console.log(data);
    };

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <label className={errors.username ? `${css.field} ${css.field_error}` : css.field} htmlFor="username">
                Username
                <input
                    id="username"
                    {...register('username', {
                        required: 'Username is required',
                        minLength: {
                            value: 6,
                            message: 'Minimum number of characters 6',
                        },
                        maxLength: {
                            value: 30,
                            message: 'Maximum number of characters 30',
                        },
                    })}
                />
                {errors.username && (
                    <span className={css.error}>{errors.username.message}</span>
                )}
            </label>

            <label
                className={errors.email ? `${css.field} ${css.field_error}` : css.field}
                htmlFor="email"
            >
                Email
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                                'The email must match the format example@example.com',
                        },
                    })}
                />
                {errors.email && (
                    <span className={css.error}>{errors.email.message}</span>
                )}
            </label>

            <label className={css.field} htmlFor="password">
                Password
                <input id="password" type="password" {...register('password')} />
            </label>

            <label className={css.field} htmlFor="passwordConfirmation">
                Password confirmation
                <input
                    id="passwordConfirmation"
                    type="password"
                    {...register('passwordConfirmation')}
                />
            </label>

            <label className={css.agree} htmlFor="agree">
                <input
                    id="agree"
                    type="checkbox"
                    className={css.checkbox}
                    {...register('agree', {
                        required: true,
                    })}
                />
                <span>
                    I agree to the{' '}
                    <Link
                        href="/terms-of-service"
                        className={css.agreeLink}
                        onClick={event => event.stopPropagation()}
                    >
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        href="/privacy-policy"
                        className={css.agreeLink}
                        onClick={event => event.stopPropagation()}
                    >
                        Privacy Policy
                    </Link>
                </span>
            </label>

            <Button type="submit" className={css.submit}>
                Sign Up
            </Button>
        </form>
    );
};
