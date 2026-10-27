'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { getErrorText } from '../model/errors';
import type { ForgotPasswordValues } from '../model/types';
import { useRecoverPassword } from '../model/useRecoverPassword';

import css from './forgot-password-form.module.scss';

export const ForgotPasswordForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordValues>({
        mode: 'onTouched', // проверяем поле, когда пользователь из него ушёл
        defaultValues: { email: '' },
    });

    const { mutate, isPending, error } = useRecoverPassword();

    // Email, на который ушла ссылка. Пока пусто — ссылку ещё не отправляли
    const [sentEmail, setSentEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSubmit = (values: ForgotPasswordValues): void => {
        // Второй аргумент mutate: что сделать после успешного ответа сервера
        mutate(values, {
            onSuccess: () => {
                setSentEmail(values.email);
                setIsModalOpen(true);
            },
        });
    };

    const isLinkSent = sentEmail !== '';

    return (
        <>
            <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
                                    'The email must match the format example@example.com',
                            },
                        })}
                    />
                    {errors.email && (
                        <span id="email-error" className={css.error}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <p className={css.hint}>
                    Enter your email address and we will send you further instructions
                </p>

                {/* После отправки, как в макете: подсказка, что письмо уже ушло */}
                {isLinkSent && (
                    <p className={css.sent}>
                        The link has been sent by email.
                        <br />
                        If you don&apos;t receive an email send link again
                    </p>
                )}

                {error && <span className={css.error}>{getErrorText(error)}</span>}

                <Button type="submit" fullWidth disabled={!isValid || isPending}>
                    {isLinkSent ? 'Send Link Again' : 'Send Link'}
                </Button>

                <Link href="/sign-in" className={css.back}>
                    Back to Sign In
                </Link>

                {/* TODO BLD-87: здесь будет reCAPTCHA */}
            </form>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Email sent"
                actions={<Button onClick={() => setIsModalOpen(false)}>OK</Button>}
            >
                <p>We have sent a link to confirm your email to {sentEmail}</p>
            </Modal>
        </>
    );
};
