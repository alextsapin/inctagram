'use client';

import { useId } from 'react';

import { useProfile } from '@/entities/profile';
import { Avatar } from '@/shared/ui/avatar';
import { Textarea } from '@/shared/ui/textarea';

import type { CreatePostPhoto } from '../model/types';

import { PhotoPreview } from './PhotoPreview';
import css from './publication-step.module.scss';

const AVATAR_SIZE = 36;
const MAX_DESCRIPTION_LENGTH = 500;
// Аватар, если пользователь его не поставил (в профиле avatar: null)
const DEFAULT_AVATAR_URL = '/profile/avatar.png';

type PublicationStepProps = {
    photos: CreatePostPhoto[]; // все фото поста
    currentIndex: number; // номер фото, которое сейчас на экране
    username: string; // имя автора, оно стоит рядом с аватаром
    description: string;
    // Пока пост отправляется, описание менять нельзя: изменения уже не попали бы в пост
    disabled: boolean;
    onShowPhoto: (index: number) => void;
    onDescriptionChange: (description: string) => void;
};

// Последний шаг окна создания поста: слева фото с фильтрами,
// справа автор и описание до 500 символов со счётчиком
export const PublicationStep = ({
    photos,
    currentIndex,
    username,
    description,
    disabled,
    onShowPhoto,
    onDescriptionChange,
}: PublicationStepProps): React.JSX.Element => {
    // Связывает подпись с полем: по клику на подпись курсор встаёт в поле
    const descriptionId = useId();
    // Аватар берём из профиля автора. Обычно профиль уже загружен
    // на странице профиля, тогда повторного запроса не будет
    const { data: profile } = useProfile(username);
    const avatarUrl = profile?.avatar ?? DEFAULT_AVATAR_URL;

    return (
        <div className={css.step}>
            <PhotoPreview
                photos={photos}
                currentIndex={currentIndex}
                disabled={disabled}
                showFilteredFile
                onShowPhoto={onShowPhoto}
            />

            <div className={css.details}>
                <div className={css.author}>
                    <Avatar src={avatarUrl} alt="" size={AVATAR_SIZE} />
                    <span className={css.username}>{username}</span>
                </div>

                {/* Наш Textarea правило не считает полем ввода, хотя подпись с ним связана через htmlFor */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor={descriptionId} className={css.label}>
                    Add publication descriptions
                </label>
                {/* readOnly, а не disabled: поле не меняет вид на короткое время отправки */}
                <Textarea
                    id={descriptionId}
                    className={css.description}
                    value={description}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    readOnly={disabled}
                    onChange={event => onDescriptionChange(event.target.value)}
                />
                <p className={css.counter}>
                    {description.length}/{MAX_DESCRIPTION_LENGTH}
                </p>
            </div>
        </div>
    );
};
