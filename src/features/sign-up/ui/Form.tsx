/* eslint-disable no-console */
/* eslint-disable lines-around-directive */
'use client';

import { useForm } from 'react-hook-form';

type SignUpValues = {
    username: string;
    email: string;
};

export const SignUpForm = (): React.JSX.Element => {
    const { register, handleSubmit } = useForm<SignUpValues>();

    const onSubmit = (data: SignUpValues): void => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">
                Username
                <input id="username" {...register('username')} />
            </label>
            <label htmlFor="email">
                Email
                <input id="email" type="email" {...register('email')} />
            </label>
            <button type="submit">Sign Up</button>
        </form>
    );
};
