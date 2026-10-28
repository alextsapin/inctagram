'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { getErrorText, isLinkExpiredError } from '../model/errors';
import type { NewPasswordValues } from '../model/types';
import { useCreateNewPassword } from '../model/useCreateNewPassword';
import { isPasswordValid, PASSWORD_ERROR } from '../model/validatePassword';

import css from './new-password-form.module.scss';

type NewPasswordFormProps = {
    code: string; // код из ссылки в письме
    onLinkExpired: () => void; // ссылка неверная или истекла: страница покажет другой экран
};

export const NewPasswordForm = ({
    code,
    onLinkExpired,
}: NewPasswordFormProps): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
    } = useForm<NewPasswordValues>({
        mode: 'onTouched', // проверяем поле, когда пользователь из него ушёл
        defaultValues: { newPassword: '', passwordConfirmation: '' },
    });

    const { mutate, isPending, error } = useCreateNewPassword();

    const onSubmit = (values: NewPasswordValues): void => {
        const request = {
            newPassword: values.newPassword,
            passwordConfirmation: values.passwordConfirmation,
            code,
        };

        // Второй аргумент mutate: что сделать, если сервер ответил ошибкой
        mutate(request, {
            onError: requestError => {
                if (isLinkExpiredError(requestError)) {
                    onLinkExpired();
                }
            },
        });
    };

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={css.field}>
                <label htmlFor="newPassword">New password</label>
                <Input
                    id="newPassword"
                    type="password"
                    showPasswordToggle
                    error={!!errors.newPassword}
                    aria-invalid={!!errors.newPassword}
                    aria-describedby={
                        errors.newPassword ? 'newPassword-error' : undefined
                    }
                    {...register('newPassword', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Minimum number of characters 6',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Maximum number of characters 20',
                        },
                        validate: value => isPasswordValid(value) || PASSWORD_ERROR,
                        // Пароль поменяли — заново проверяем поле подтверждения
                        deps: 'passwordConfirmation',
                    })}
                />
                {errors.newPassword && (
                    <span id="newPassword-error" className={css.error}>
                        {errors.newPassword.message}
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
                            value === getValues('newPassword') ||
                            'The passwords must match',
                    })}
                />
                {errors.passwordConfirmation && (
                    <span id="passwordConfirmation-error" className={css.error}>
                        {errors.passwordConfirmation.message}
                    </span>
                )}
            </div>

            <p className={css.hint}>Your password must be between 6 and 20 characters</p>

            {error && <span className={css.error}>{getErrorText(error)}</span>}

            <Button type="submit" fullWidth disabled={!isValid || isPending}>
                Create new password
            </Button>
        </form>
    );
};
