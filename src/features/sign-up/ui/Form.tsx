/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { getSignUpErrorText } from '../model/getSignUpErrorText';
import type { SignUpValues } from '../model/types';
import { useSignUp } from '../model/useSignUp';
import { validatePassword } from '../model/validatePassword';

import css from './form.module.scss';

export const SignUpForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
    } = useForm<SignUpValues>({
        mode: 'onChange',
        defaultValues: {
            termsAccepted: false,
        },
    });

    const { mutate, isPending, error } = useSignUp();
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

    const onSubmit = (values: SignUpValues): void => {
        mutate(values, {
            onSuccess: ({ email }) => {
                setRegisteredEmail(email);
            },
        });
    };

    return (
        <>
            <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={css.field}>
                    <label htmlFor="username">Username</label>
                    <Input
                        id="username"
                        error={!!errors.username}
                        aria-invalid={!!errors.username}
                        aria-describedby={errors.username ? 'username-error' : undefined}
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
                                message:
                                    'Only Latin letters, numbers, _ and - are allowed',
                            },
                        })}
                    />
                    {errors.username && (
                        <span id="username-error" className={css.error}>
                            {errors.username.message}
                        </span>
                    )}
                </div>

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
                            validate: validatePassword,
                            deps: ['passwordConfirmation'],
                        })}
                    />
                    {errors.password && (
                        <span id="password-error" className={css.error}>
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <div className={css.field}>
                    <label htmlFor="passwordConfirmation">Password confirmation</label>
                    <Input
                        id="passwordConfirmation"
                        type="password"
                        showPasswordToggle
                        error={!!errors.passwordConfirmation}
                        aria-invalid={!!errors.passwordConfirmation}
                        aria-describedby={
                            errors.passwordConfirmation
                                ? 'passwordConfirmation-error'
                                : undefined
                        }
                        {...register('passwordConfirmation', {
                            required: 'Password confirmation is required',
                            validate: value =>
                                value === getValues('password') ||
                                'The passwords must match',
                        })}
                    />
                    {errors.passwordConfirmation && (
                        <span id="passwordConfirmation-error" className={css.error}>
                            {errors.passwordConfirmation.message}
                        </span>
                    )}
                </div>

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
                {errors.termsAccepted && (
                    <span className={css.error}>{errors.termsAccepted.message}</span>
                )}

                {error && (
                    <span className={css.error} role="alert">
                        {getSignUpErrorText(error)}
                    </span>
                )}

                <Button type="submit" fullWidth disabled={!isValid || isPending}>
                    {isPending ? 'Signing Up...' : 'Sign Up'}
                </Button>

                <div className={css.redirect}>
                    <span>Do you have an account?</span>
                    <Link href="/sign-in">Sign In</Link>
                </div>
            </form>

            <Modal
                open={registeredEmail !== null}
                onClose={() => setRegisteredEmail(null)}
                title="Email sent"
                actions={<Button onClick={() => setRegisteredEmail(null)}>OK</Button>}
            >
                <p>We have sent a link to confirm your email to {registeredEmail}</p>
            </Modal>
        </>
    );
};
