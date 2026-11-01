'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { useResendVerification } from '../model/useResendVerification';

import css from './resend-verification-form.module.scss';

type ResendValues = {
    email: string;
};

const TOO_MANY_REQUESTS = 429;

const getErrorText = (error: Error): string => {
    const status = isAxiosError(error) ? error.response?.status : undefined;

    if (status === TOO_MANY_REQUESTS) {
        return 'Too many attempts. Please try again later.';
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

    const { mutate, isPending, error } = useResendVerification();
    const [sentEmail, setSentEmail] = useState<string | null>(null);

    const onSubmit = (values: ResendValues): void => {
        mutate(values.email, {
            onSuccess: data => {
                setSentEmail(data.email);
            },
        });
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

                {error && <span className={css.error}>{getErrorText(error)}</span>}

                <Button
                    type="submit"
                    fullWidth
                    disabled={!isValid || isPending || isSubmitting}
                >
                    Resend verification link
                </Button>
            </form>

            <Modal
                open={sentEmail !== null}
                onClose={() => setSentEmail(null)}
                title="Email sent"
                actions={<Button onClick={() => setSentEmail(null)}>OK</Button>}
            >
                <p>We have sent a link to confirm your email to {sentEmail}</p>
            </Modal>
        </>
    );
};
