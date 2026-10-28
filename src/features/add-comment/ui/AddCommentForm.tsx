/* eslint-disable no-magic-numbers */

'use client';

import { useEffect } from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';

import s from './add-comment-form.module.scss';

type Props = {
    postId: string;
    replyToId: string | null;
    onCancelReply: () => void;
    onSuccess: () => void;
};
type FormValues = { text: string };

export const AddCommentForm = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postId,
    onSuccess,
    replyToId,
}: Props): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        resetField,
        setFocus,
        formState: { isValid, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { text: '' },
        mode: 'onChange',
    });

    useEffect(() => {
        if (replyToId) {
            setFocus('text');
        }
    }, [replyToId, setFocus]);

    const onSubmit: SubmitHandler<FormValues> = async data => {
        // TODO мутация postId и repleyToId

        await new Promise(resolve => {
            setTimeout(() => resolve(data), 1000);
        });

        resetField('text');
        onSuccess();
    };

    const isDisabled = !isValid || isSubmitting;

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                className={s.input}
                placeholder="Add a Comment..."
                {...register('text', {
                    validate: value => value.trim().length > 0,
                })}
            />

            <button type="submit" className={s['submit-btn']} disabled={isDisabled}>
                Publish
            </button>
        </form>
    );
};
