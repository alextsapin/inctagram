'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';

import { isAxiosError } from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';

import { RECAPTCHA_INVISIBLE_SITE_KEY } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { useResendVerification } from '../model/useResendVerification';

import css from './resend-verification-form.module.scss';

type ResendValues = {
    email: string;
};

const TOO_MANY_REQUESTS = 429;
const FORBIDDEN = 403;
const RECAPTCHA_ERROR = 'Verification failed. Please try again.';

const getErrorText = (error: Error): string => {
    const status = isAxiosError(error) ? error.response?.status : undefined;

    if (status === TOO_MANY_REQUESTS) {
        return 'Too many attempts. Please try again later.';
    }

    if (status === FORBIDDEN) {
        return RECAPTCHA_ERROR;
    }

    return 'Failed to resend the link. Please try again later.';
};

export const ResendVerificationForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<ResendValues>({
        mode: 'onTouched',
        defaultValues: { email: '' },
    });

    const {
        mutateAsync,
        isPending,
        error,
        reset: resetMutation,
    } = useResendVerification();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const [sentEmail, setSentEmail] = useState<string | null>(null);
    const formError = recaptchaError ?? (error ? getErrorText(error) : null);

    const onSubmit = async (values: ResendValues): Promise<void> => {
        setRecaptchaError(null);
        resetMutation();
        recaptchaRef.current?.reset();

        let token: string | null | undefined;

        try {
            token = await recaptchaRef.current?.executeAsync();
        } catch {
            setRecaptchaError(RECAPTCHA_ERROR);

            return;
        }

        if (!token) {
            setRecaptchaError(RECAPTCHA_ERROR);

            return;
        }

        try {
            const response = await mutateAsync({
                email: values.email,
                recaptchaToken: token,
            });

            setSentEmail(response.email ?? values.email);
        } catch {
            // Ошибку запроса показывает formError; значение email сохраняем.
        } finally {
            recaptchaRef.current?.reset();
        }
    };

    return (
        <>
            <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={css.field}>
                    <label htmlFor="resend-email">Email</label>
                    <Input
                        id="resend-email"
                        type="email"
                        placeholder="Epam@epam.com"
                        error={!!errors.email}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'resend-email-error' : undefined}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message:
                                    'The email must match the format example@example.com',
                            },
                        })}
                    />
                    {errors.email && (
                        <span id="resend-email-error" className={css.error}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {formError && (
                    <span className={css.error} role="alert">
                        {formError}
                    </span>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={!isValid || isPending || isSubmitting}
                >
                    Resend verification link
                </Button>

                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_INVISIBLE_SITE_KEY}
                    size="invisible"
                    theme="dark"
                    hl="en"
                />
            </form>

            <Modal
                open={sentEmail !== null}
                onClose={() => setSentEmail(null)}
                title="Request received"
                actions={<Button onClick={() => setSentEmail(null)}>OK</Button>}
            >
                <p>If verification is needed, a new link will be sent to {sentEmail}.</p>
            </Modal>
        </>
    );
};
