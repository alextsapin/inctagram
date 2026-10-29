'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';

import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';

import {
    RECAPTCHA_CHECKBOX_SITE_KEY,
    RECAPTCHA_INVISIBLE_SITE_KEY,
} from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { getErrorText } from '../model/errors';
import type { ForgotPasswordValues, RecaptchaType } from '../model/types';
import { useRecoverPassword } from '../model/useRecoverPassword';

import css from './forgot-password-form.module.scss';

export const ForgotPasswordForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<ForgotPasswordValues>({
        mode: 'onTouched', // проверяем поле, когда пользователь из него ушёл
        defaultValues: { email: '' },
    });

    const { mutate, isPending, error } = useRecoverPassword();

    // Email, на который ушла ссылка. Пока пусто — ссылку ещё не отправляли
    const [sentEmail, setSentEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Токен от галочки «I'm not a robot». Пока галочка не отмечена — null
    const [checkboxToken, setCheckboxToken] = useState<string | null>(null);

    // Ссылки на виджеты reCAPTCHA, чтобы вызывать у них reset() и executeAsync()
    const checkboxRef = useRef<ReCAPTCHA>(null);
    const invisibleRef = useRef<ReCAPTCHA>(null);

    const isLinkSent = sentEmail !== '';

    const sendLink = (
        email: string,
        recaptchaToken: string,
        recaptchaType: RecaptchaType,
    ): void => {
        mutate(
            { email, recaptchaToken, recaptchaType },
            {
                onSuccess: () => {
                    setSentEmail(email);
                    setIsModalOpen(true);
                },
                // После ответа, удачного или нет: токен одноразовый, второй раз бэкенд его не примет.
                // Снимаем галочку, чтобы пользователь отметил её заново
                onSettled: () => {
                    checkboxRef.current?.reset();
                    setCheckboxToken(null);
                },
            },
        );
    };

    const onSubmit = async (values: ForgotPasswordValues): Promise<void> => {
        // Первая отправка: токен уже есть, его дала галочка
        if (!isLinkSent) {
            if (checkboxToken) {
                sendLink(values.email, checkboxToken, 'checkbox');
            }

            return;
        }

        // Send Link Again: галочки нет, токен просим у невидимой reCAPTCHA.
        // reset() перед запросом нужен, чтобы получить новый токен, а не прошлый
        invisibleRef.current?.reset();
        const token = await invisibleRef.current?.executeAsync();

        if (token) {
            sendLink(values.email, token, 'invisible');
        }
    };

    // Без галочки первую ссылку отправить нельзя. Для Send Link Again галочка не нужна
    const isRecaptchaMissing = !isLinkSent && !checkboxToken;

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

                <Button
                    type="submit"
                    fullWidth
                    disabled={!isValid || isPending || isSubmitting || isRecaptchaMissing}
                >
                    {isLinkSent ? 'Send Link Again' : 'Send Link'}
                </Button>

                <Link href="/sign-in" className={css.back}>
                    Back to Sign In
                </Link>

                {/* Виджет Google «I'm not a robot» для первой отправки.
                    После отправки ссылки его нет, как в макете */}
                {!isLinkSent && (
                    <ReCAPTCHA
                        ref={checkboxRef}
                        sitekey={RECAPTCHA_CHECKBOX_SITE_KEY}
                        theme="dark"
                        hl="en" // язык виджета, как у интерфейса; иначе Google возьмёт язык браузера
                        className={css.captcha}
                        onChange={setCheckboxToken} // отметили галочку: пришёл токен
                        onExpired={() => setCheckboxToken(null)} // токен живёт 2 минуты
                    />
                )}

                {/* Невидимая reCAPTCHA для Send Link Again. На экране только значок Google
                    в правом нижнем углу: Google требует его показывать */}
                {isLinkSent && (
                    <ReCAPTCHA
                        ref={invisibleRef}
                        sitekey={RECAPTCHA_INVISIBLE_SITE_KEY}
                        size="invisible"
                        theme="dark"
                        hl="en"
                    />
                )}
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
