'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useForm } from 'react-hook-form';

import { useCurrentUser } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Sidebar } from '@/widgets/sidebar';

import css from './profile-settings.module.scss';

type ProfileSettingsValues = {
    username: string;
    email: string;
};

const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ProfileSettings = (): React.JSX.Element => {
    const { data: user, isPending, isError } = useCurrentUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileSettingsValues>({
        mode: 'onTouched',
        values: user
            ? { username: user.username, email: user.email }
            : { username: '', email: '' },
    });

    const onSubmit = (): void => {
        // TODO: подключить сохранение, когда в API появится endpoint обновления профиля
    };

    return (
        <div className={css.layout}>
            <Sidebar />

            <main className={css.settings}>
                <h1 className={css.title}>Profile Settings</h1>

                {isPending && (
                    <p className={css.message} role="status">
                        Loading profile…
                    </p>
                )}

                {isError && (
                    <p className={css.message} role="alert">
                        Failed to load profile. Please sign in and try again.
                    </p>
                )}

                {user && (
                    <form
                        className={css.form}
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <div className={css.field}>
                            <label htmlFor="username">Username</label>
                            <Input
                                id="username"
                                error={!!errors.username}
                                aria-invalid={!!errors.username}
                                aria-describedby={
                                    errors.username ? 'username-error' : undefined
                                }
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
                                        value: USERNAME_PATTERN,
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
                                aria-describedby={
                                    errors.email ? 'email-error' : undefined
                                }
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: EMAIL_PATTERN,
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

                        <Button type="submit" disabled={!isDirty}>
                            Save Changes
                        </Button>
                    </form>
                )}
            </main>
        </div>
    );
};
