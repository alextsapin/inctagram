'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import Link from 'next/link';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import { CITY_OPTIONS, COUNTRY_OPTIONS } from '../model/options';
import {
    aboutMeRules,
    dateOfBirthRules,
    firstNameRules,
    lastNameRules,
    usernameRules,
} from '../model/rules';
import type { EditProfileValues } from '../model/types';

import css from './edit-profile-form.module.scss';

type EditProfileFormProps = {
    // Username приходит с сервера. Остальных полей в API пока нет, поэтому они пустые
    username: string;
};

export const EditProfileForm = ({
    username,
}: EditProfileFormProps): React.JSX.Element => {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<EditProfileValues>({
        mode: 'onTouched',
        defaultValues: {
            username,
            firstName: '',
            lastName: '',
            dateOfBirth: undefined,
            country: '',
            city: '',
            aboutMe: '',
        },
    });

    // Список городов зависит от выбранной страны.
    // useWatch, а не watch: watch не дружит с React Compiler, который включён в проекте
    const country = useWatch({ control, name: 'country' });
    const cityOptions = CITY_OPTIONS[country] ?? [];

    const onSubmit = (): void => {
        // TODO: отправить данные, когда в API появится эндпоинт обновления профиля
    };

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={css.fields}>
                <div className={css.field}>
                    <label htmlFor="username" className={css.label}>
                        Username<span className={css.required}>*</span>
                    </label>
                    <Input
                        id="username"
                        error={!!errors.username}
                        aria-describedby={errors.username ? 'username-error' : undefined}
                        {...register('username', usernameRules)}
                    />
                    {errors.username && (
                        <span id="username-error" className={css.error}>
                            {errors.username.message}
                        </span>
                    )}
                </div>

                <div className={css.field}>
                    <label htmlFor="firstName" className={css.label}>
                        First Name<span className={css.required}>*</span>
                    </label>
                    <Input
                        id="firstName"
                        error={!!errors.firstName}
                        aria-describedby={
                            errors.firstName ? 'firstName-error' : undefined
                        }
                        {...register('firstName', firstNameRules)}
                    />
                    {errors.firstName && (
                        <span id="firstName-error" className={css.error}>
                            {errors.firstName.message}
                        </span>
                    )}
                </div>

                <div className={css.field}>
                    <label htmlFor="lastName" className={css.label}>
                        Last Name<span className={css.required}>*</span>
                    </label>
                    <Input
                        id="lastName"
                        error={!!errors.lastName}
                        aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                        {...register('lastName', lastNameRules)}
                    />
                    {errors.lastName && (
                        <span id="lastName-error" className={css.error}>
                            {errors.lastName.message}
                        </span>
                    )}
                </div>

                <div className={css.field}>
                    <label htmlFor="dateOfBirth" className={css.label}>
                        Date of birth
                    </label>
                    {/* DatePicker и Select — не обычные input, поэтому подключаем через Controller */}
                    <Controller
                        name="dateOfBirth"
                        control={control}
                        rules={dateOfBirthRules}
                        render={({ field }) => (
                            <DatePicker
                                id="dateOfBirth"
                                value={field.value}
                                onChange={date => {
                                    field.onChange(date);
                                    // У календаря нет blur. Вызываем onBlur сами,
                                    // чтобы форма сразу проверила дату (режим onTouched)
                                    field.onBlur();
                                }}
                                error={!!errors.dateOfBirth}
                                fullWidth
                            />
                        )}
                    />
                    {errors.dateOfBirth && (
                        <span className={css.error}>
                            {errors.dateOfBirth.message}{' '}
                            <Link href="/privacy-policy" className={css['error-link']}>
                                Privacy Policy
                            </Link>
                        </span>
                    )}
                </div>

                <div className={css.row}>
                    <div className={css.field}>
                        <label htmlFor="country" className={css.label}>
                            Select your country
                        </label>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="country"
                                    options={COUNTRY_OPTIONS}
                                    value={field.value}
                                    placeholder="Country"
                                    onChange={value => {
                                        field.onChange(value);
                                        // Новая страна — старый город ей не подходит, сбрасываем
                                        setValue('city', '');
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.field}>
                        <label htmlFor="city" className={css.label}>
                            Select your city
                        </label>
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="city"
                                    options={cityOptions}
                                    value={field.value}
                                    placeholder="City"
                                    onChange={field.onChange}
                                    // Пока страна не выбрана, городов нет
                                    disabled={!country}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className={css.field}>
                    <label htmlFor="aboutMe" className={css.label}>
                        About Me
                    </label>
                    <Textarea
                        id="aboutMe"
                        error={!!errors.aboutMe}
                        aria-describedby={errors.aboutMe ? 'aboutMe-error' : undefined}
                        {...register('aboutMe', aboutMeRules)}
                    />
                    {errors.aboutMe && (
                        <span id="aboutMe-error" className={css.error}>
                            {errors.aboutMe.message}
                        </span>
                    )}
                </div>
            </div>

            <div className={css.footer}>
                {/* Кнопка неактивна, пока в форме есть ошибки или пустые обязательные поля */}
                <Button type="submit" disabled={!isValid}>
                    Save Changes
                </Button>
            </div>
        </form>
    );
};
