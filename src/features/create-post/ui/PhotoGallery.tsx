'use client';

import { useRef } from 'react';

import { useObjectUrl } from '@/shared/hooks';
import { ALLOWED_PHOTO_TYPES } from '@/shared/lib';
import { CloseSmallIcon, PlusCircleIcon } from '@/shared/ui/icons';

import { MAX_PHOTOS } from '../model/photoRules';
import type { CreatePostPhoto } from '../model/types';

import css from './photo-gallery.module.scss';

type PhotoThumbnailProps = {
    photo: CreatePostPhoto;
    number: number; // номер фото для подписи кнопки, с 1
    onShow: () => void;
    onRemove: () => void;
};

// Миниатюра одного фото: нажатие показывает фото, крестик удаляет его.
// Крестик лежит рядом с кнопкой миниатюры, а не внутри: кнопку в кнопку вкладывать нельзя
const PhotoThumbnail = ({
    photo,
    number,
    onShow,
    onRemove,
}: PhotoThumbnailProps): React.JSX.Element => {
    const photoUrl = useObjectUrl(photo.originalFile);

    return (
        <li className={css.item}>
            <button
                type="button"
                className={css.thumbnail}
                aria-label={`Show photo ${number}`}
                onClick={onShow}
            >
                {/* Обычный <img>: next/image не работает с временными ссылками blob: */}
                {photoUrl && <img src={photoUrl} alt="" className={css.image} />}
            </button>

            <button
                type="button"
                className={css.remove}
                aria-label={`Delete photo ${number}`}
                onClick={onRemove}
            >
                <CloseSmallIcon />
            </button>
        </li>
    );
};

type PhotoGalleryProps = {
    photos: CreatePostPhoto[];
    onShow: (index: number) => void; // нажали на миниатюру
    onAdd: (file: File) => void; // выбрали файл плюсом. Файл проверяет окно
    onRemove: (photoId: string) => void; // нажали на крестик
};

// Панель галереи на шаге Cropping: миниатюры всех фото поста и плюс, который добавляет фото
export const PhotoGallery = ({
    photos,
    onShow,
    onAdd,
    onRemove,
}: PhotoGalleryProps): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);

    // На 10-м фото плюс становится неактивным
    const canAdd = photos.length < MAX_PHOTOS;

    // Плюс нажимает спрятанный <input type="file">, как кнопка на шаге Add Photo
    const openFileDialog = (): void => {
        inputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];

        // Очищаем поле: иначе повторный выбор того же файла не сработает
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (file) {
            onAdd(file);
        }
    };

    return (
        <div className={css.gallery}>
            <ul className={css.list}>
                {photos.map((photo, index) => (
                    <PhotoThumbnail
                        key={photo.id}
                        photo={photo}
                        number={index + 1}
                        onShow={() => onShow(index)}
                        onRemove={() => onRemove(photo.id)}
                    />
                ))}
            </ul>

            <button
                type="button"
                className={css.add}
                aria-label="Add photo"
                disabled={!canAdd}
                onClick={openFileDialog}
            >
                <PlusCircleIcon />
            </button>

            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_PHOTO_TYPES.join(', ')}
                className={css.input}
                onChange={handleFileChange}
            />
        </div>
    );
};
