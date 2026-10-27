'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useForm, Controller } from 'react-hook-form';

import { useCurrentUser } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Sidebar } from '@/widgets/sidebar';

import css from './profile-settings.module.scss';

type ProfileSettingsValues = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    aboutMe: string;
    dateOfBirth: Date | null;
    country: string;
    city: string;
};

const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё' -]+$/;

const MAX_ABOUT_ME_LENGTH = 200;

// Поля, для которых пока нет данных в API, заполняются пустыми значениями.
// Сохранение будет подключено, когда появится endpoint обновления профиля.
const DEFAULT_VALUES: ProfileSettingsValues = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    aboutMe: '',
    dateOfBirth: null,
    country: '',
    city: '',
};

export const ProfileSettings = (): React.JSX.Element => {
    const { data: user, isPending, isError } = useCurrentUser();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isDirty },
    } = useForm<ProfileSettingsValues>({
        mode: 'onTouched',
        values: user
            ? { ...DEFAULT_VALUES, username: user.username, email: user.email }
            : DEFAULT_VALUES,
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
                            <label htmlFor="firstName">First Name</label>
                            <Input
                                id="firstName"
                                error={!!errors.firstName}
                                aria-invalid={!!errors.firstName}
                                aria-describedby={
                                    errors.firstName ? 'firstName-error' : undefined
                                }
                                {...register('firstName', {
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum number of characters 50',
                                    },
                                    pattern: {
                                        value: NAME_PATTERN,
                                        message:
                                            'Only letters, spaces, apostrophes and dashes are allowed',
                                    },
                                })}
                            />
                            {errors.firstName && (
                                <span id="firstName-error" className={css.error}>
                                    {errors.firstName.message}
                                </span>
                            )}
                        </div>

                        <div className={css.field}>
                            <label htmlFor="lastName">Last Name</label>
                            <Input
                                id="lastName"
                                error={!!errors.lastName}
                                aria-invalid={!!errors.lastName}
                                aria-describedby={
                                    errors.lastName ? 'lastName-error' : undefined
                                }
                                {...register('lastName', {
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum number of characters 50',
                                    },
                                    pattern: {
                                        value: NAME_PATTERN,
                                        message:
                                            'Only letters, spaces, apostrophes and dashes are allowed',
                                    },
                                })}
                            />
                            {errors.lastName && (
                                <span id="lastName-error" className={css.error}>
                                    {errors.lastName.message}
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

                        <div className={css.field}>
                            <label htmlFor="aboutMe">About Me</label>
                            <Textarea
                                id="aboutMe"
                                error={!!errors.aboutMe}
                                aria-invalid={!!errors.aboutMe}
                                aria-describedby={
                                    errors.aboutMe ? 'aboutMe-error' : undefined
                                }
                                {...register('aboutMe', {
                                    maxLength: {
                                        value: MAX_ABOUT_ME_LENGTH,
                                        message: `Maximum number of characters ${MAX_ABOUT_ME_LENGTH}`,
                                    },
                                })}
                            />
                            {errors.aboutMe && (
                                <span id="aboutMe-error" className={css.error}>
                                    {errors.aboutMe.message}
                                </span>
                            )}
                        </div>

                        <div className={css.field}>
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }): React.JSX.Element => (
                                    <DatePicker
                                        id="dateOfBirth"
                                        value={field.value ?? undefined}
                                        onChange={field.onChange}
                                        error={!!errors.dateOfBirth}
                                    />
                                )}
                            />
                        </div>

                        <div className={css.field}>
                            <label htmlFor="country">Country</label>
                            <Input
                                id="country"
                                {...register('country', {
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum number of characters 50',
                                    },
                                })}
                            />
                            {errors.country && (
                                <span className={css.error}>
                                    {errors.country.message}
                                </span>
                            )}
                        </div>

                        <div className={css.field}>
                            <label htmlFor="city">City</label>
                            <Input
                                id="city"
                                {...register('city', {
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum number of characters 50',
                                    },
                                })}
                            />
                            {errors.city && (
                                <span className={css.error}>{errors.city.message}</span>
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
