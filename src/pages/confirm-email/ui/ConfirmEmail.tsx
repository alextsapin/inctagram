'use client';

import { useEffect, useRef } from 'react';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';

import { ResendVerificationForm, useConfirmEmail } from '@/features/confirm-email';

import expiredImage from '../assets/email-confirmation-expired.png';
import successImage from '../assets/email-confirmation-success.png';

import css from './confirm-email.module.scss';

type ConfirmEmailProps = {
    code: string;
};

const BAD_REQUEST = 400;
const TOO_MANY_REQUESTS = 429;

const getErrorMessage = (error: Error | null): string => {
    const status = isAxiosError(error) ? error.response?.status : undefined;

    if (status === BAD_REQUEST) {
        return 'Confirmation link is invalid or expired.';
    }

    if (status === TOO_MANY_REQUESTS) {
        return 'Too many attempts. Please try again later.';
    }

    return 'Email confirmation failed. Please try again later.';
};

export const ConfirmEmail = ({ code }: ConfirmEmailProps): React.JSX.Element => {
    const { mutate, isPending, isSuccess, isError, error } = useConfirmEmail();

    const requestedCode = useRef<string | null>(null);

    useEffect(() => {
        if (!code || requestedCode.current === code) {
            return;
        }

        requestedCode.current = code;
        mutate(code);
    }, [code, mutate]);

    if (!code) {
        return (
            <div className={css.root}>
                <h1 className={css.title}>Email verification link expired</h1>

                <p className={css.text}>
                    Looks like the verification link has expired. Not to worry, we can
                    send the link again
                </p>

                <ResendVerificationForm />

                <Image
                    className={css.image}
                    src={expiredImage}
                    alt="Email confirmation expired"
                />
            </div>
        );
    }

    if (!isSuccess) {
        let message = 'Preparing confirmation...';

        if (isError) {
            message = getErrorMessage(error);
        } else if (isPending) {
            message = 'Confirming your email...';
        }

        return (
            <main className="container">
                <p className={css.alert} role={isError ? 'alert' : 'status'}>
                    {message}
                </p>
            </main>
        );
    }

    return (
        <main className="container">
            <div className={css.root}>
                <h1 className={css.title}>Congratulations!</h1>

                <p className={css.text}>Your email has been confirmed</p>

                <Link className={css.link} href="/sign-in">
                    Sign In
                </Link>

                <Image
                    className={css.image}
                    src={successImage}
                    alt="Email successfully confirmed"
                />
            </div>
        </main>
    );
};
