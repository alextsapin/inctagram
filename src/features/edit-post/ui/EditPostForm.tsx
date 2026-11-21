'use client';

import { useEffect } from 'react';

import { useForm, useWatch } from 'react-hook-form';

import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';

import { useEditPost } from '../model/useEditPost';

import s from './edit-post-form.module.scss';

const MAX_LENGTH = 500;

type Props = {
    postId: string;
    initialCaption: string;
    onSuccess: () => void;
    onDirtyChange: (isDirty: boolean) => void;
};

type FormValues = { caption: string };

export const EditPostForm = ({
    postId,
    initialCaption,
    onSuccess,
    onDirtyChange,
}: Props): React.JSX.Element => {
    const {
        register,
        control,
        handleSubmit,
        formState: { isDirty, isValid },
    } = useForm<FormValues>({
        defaultValues: { caption: initialCaption },
        mode: 'onChange',
    });

    useEffect(() => {
        // Поднимаем наверх изменения
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);
    const { mutateAsync, isPending, isError, error, reset } = useEditPost();

    // Следим за длиной текста для счетчика
    const captionValue = useWatch({ control, name: 'caption' });
    const currentLength = captionValue?.length || 0;

    const onSubmit = async (data: FormValues): Promise<void> => {
        try {
            await mutateAsync({ postId, caption: data.caption });
            onSuccess();
        } catch {
            // Ошибка уже обрабатывается через isError в JSX
        }
    };

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            {isError && (
                <Alert
                    open
                    onClose={reset}
                    type="error"
                    message={error?.message || 'Failed to save changes'}
                />
            )}
            <div className={s.body}>
                <label htmlFor="caption" className={s.label}>
                    Add publication descriptions
                    <textarea
                        className={s.textarea}
                        placeholder="Write a caption..."
                        maxLength={MAX_LENGTH}
                        {...register('caption', {
                            validate: val => val.length <= MAX_LENGTH,
                        })}
                        id="caption"
                    />
                </label>

                <div className={s.counter}>
                    {currentLength}/{MAX_LENGTH}
                </div>
            </div>

            <div className={s.footer}>
                <Button
                    type="submit"
                    disabled={!isDirty || !isValid || isPending}
                    className={s['submit-btn']}
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
