/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable lines-around-directive */
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';

import css from './form.module.scss';

type SignUpValues = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    termsAccepted: boolean;
};

export const SignUpForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<SignUpValues>({
        mode: 'onBlur',
        defaultValues: {
            termsAccepted: false,
        },
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
                        pattern: {
                            value: /^[A-Za-z0-9_-]+$/,
                            message: 'Only Latin letters, numbers, _ and - are allowed',
                        },
                    })}
                />
                {errors.username && <span className={css.error}>{errors.username.message}</span>}
            </label>

            <label className={errors.email ? `${css.field} ${css.field_error}` : css.field} htmlFor="email">
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
                        maxLength: {
                            value: 255,
                            message: 'Maximum number of characters 255',
                        },
                    })}
                />
                {errors.email && <span className={css.error}>{errors.email.message}</span>}
            </label>

            <label className={errors.password ? `${css.field} ${css.field_error}` : css.field} htmlFor="password">
                Password
                <input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Minimum number of characters 6',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Maximum number of characters 20',
                        },
                    })}
                />
                {errors.password && <span className={css.error}>{errors.password.message}</span>}
            </label>

            <label
                className={
                    errors.passwordConfirmation
                        ? `${css.field} ${css.field_error}`
                        : css.field
                }
                htmlFor="passwordConfirmation"
            >
                Password confirmation
                <input
                    id="passwordConfirmation"
                    type="password"
                    {...register('passwordConfirmation', {
                        required: 'Password confirmation is required',
                        validate: value =>
                            value === getValues('password') || 'The passwords must match',
                    })}
                />
                {errors.passwordConfirmation && <span className={css.error}>{errors.passwordConfirmation.message}</span>}
            </label>

            <div className={css.agree}>
                <label className={css['agree-label']} htmlFor="termsAccepted">
                    <Checkbox
                        id="termsAccepted"
                        {...register('termsAccepted', {
                            required: 'You must agree to the terms',
                        })}
                    />
                    I agree to the{' '}
                </label>
                <Link href="/terms-of-service" className={css['agree-link']}>
                    Terms of Service
                </Link>
                <span className={css['agree-separator']}> and </span>
                <Link href="/privacy-policy" className={css['agree-link']}>
                    Privacy Policy
                </Link>
            </div>
            {errors.termsAccepted && <span className={css.error}>{errors.termsAccepted.message}</span>}

            <Button type="submit" fullWidth>
                Sign Up
            </Button>

            <div className={css.redirect}>
                <span>Do you have an account?</span>
                <Link href="/sign-in">Sign In</Link>
            </div>
        </form>
    );
};
