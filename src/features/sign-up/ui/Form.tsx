/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';

import { RECAPTCHA_INVISIBLE_SITE_KEY } from '@/shared/config';
import { validatePassword } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { getSignUpErrorText, RECAPTCHA_ERROR } from '../model/getSignUpErrorText';
import type { SignUpValues } from '../model/types';
import { useSignUp } from '../model/useSignUp';

import css from './form.module.scss';

export const SignUpForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        getValues,
        reset,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm<SignUpValues>({
        mode: 'onTouched',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            termsAccepted: false,
        },
    });

    const { mutateAsync, isPending, error, reset: resetMutation } = useSignUp();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

    const termsAccepted = watch('termsAccepted');
    const isBusy = isPending || isSubmitting;
    const formError = recaptchaError ?? (error ? getSignUpErrorText(error) : null);

    const resetRecaptcha = (): void => {
        recaptchaRef.current?.reset();
    };

    const handleCloseSuccessModal = (): void => {
        setRegisteredEmail(null);
        setRecaptchaError(null);
        resetMutation();
        reset();
        resetRecaptcha();
    };

    const onSubmit = async (values: SignUpValues): Promise<void> => {
        setRecaptchaError(null);
        resetMutation();
        resetRecaptcha();

        let token: string | null | undefined;

        try {
            token = await recaptchaRef.current?.executeAsync();
        } catch {
            setRecaptchaError(RECAPTCHA_ERROR);
            resetRecaptcha();

            return;
        }

        if (!token) {
            setRecaptchaError(RECAPTCHA_ERROR);
            resetRecaptcha();

            return;
        }

        try {
            const data = await mutateAsync({ ...values, recaptchaToken: token });

            setRegisteredEmail(data.email ?? values.email);
        } catch {
            // Ошибку API показывает getSignUpErrorText(error); данные формы сохраняем
        } finally {
            resetRecaptcha();
        }
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

                {formError && (
                    <span className={css.error} role="alert">
                        {formError}
                    </span>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={!isValid || !termsAccepted || isBusy}
                >
                    {isBusy ? 'Signing Up...' : 'Sign Up'}
                </Button>

                <div className={css.redirect}>
                    <span>Do you have an account?</span>
                    <Link href="/sign-in">Sign In</Link>
                </div>

                {/* Невидимая reCAPTCHA: галочки нет, на экране только значок Google
                    в правом нижнем углу — Google требует его показывать */}
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_INVISIBLE_SITE_KEY}
                    size="invisible"
                    theme="dark"
                    hl="en"
                />
            </form>

            <Modal
                open={registeredEmail !== null}
                onClose={handleCloseSuccessModal}
                title="Email sent"
                actions={<Button onClick={handleCloseSuccessModal}>OK</Button>}
            >
                <p>We have sent a link to confirm your email to {registeredEmail}</p>
            </Modal>
        </>
    );
};
