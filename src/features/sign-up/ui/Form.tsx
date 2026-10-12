/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable lines-around-directive */
'use client';

import { useForm } from 'react-hook-form';

import css from './form.module.scss';

type SignUpValues = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

export const SignUpForm = (): React.JSX.Element => {
    const { register, handleSubmit } = useForm<SignUpValues>();

    const onSubmit = (data: SignUpValues): void => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className={css.field} htmlFor="username">
                Username
                <input id="username" {...register('username')} />
            </label>

            <label className={css.field} htmlFor="email">
                Email
                <input id="email" type="email" {...register('email')} />
            </label>

            <label className={css.field} htmlFor="password">
                Password
                <input id="password" type="password" {...register('password')} />
            </label>

            <label className={css.field} htmlFor="passwordConfirmation">
                Password confirmation
                <input
                    id="passwordConfirmation"
                    type="password"
                    {...register('passwordConfirmation')}
                />
            </label>

            <button type="submit">Sign Up</button>
        </form>
    );
};
