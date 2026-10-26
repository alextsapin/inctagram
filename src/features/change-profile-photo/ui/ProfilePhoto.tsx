'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/shared/ui/button';

import closeOutline from '../assets/close-outline.svg';
import imageOutline from '../assets/image-outline.svg';

import { AddPhotoModal } from './AddPhotoModal';
import { DeletePhotoModal } from './DeletePhotoModal';
import css from './profile-photo.module.scss';

const ICON_SIZE = 48;
const CLOSE_ICON_SIZE = 16;

// Аватарка, кнопка загрузки и крестик удаления.
// В API пока нет эндпоинта для аватарки, поэтому фото хранится только здесь, в состоянии,
// и пропадает после перезагрузки страницы
export const ProfilePhoto = (): React.JSX.Element => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const savePhoto = (photo: Blob): void => {
        // TODO: загрузить фото на сервер, когда в API появится эндпоинт аватарки

        // Старая временная ссылка больше не нужна, освобождаем память
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }

        setPhotoUrl(URL.createObjectURL(photo));
    };

    const deletePhoto = (): void => {
        // TODO: удалить фото на сервере, когда в API появится эндпоинт аватарки
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }

        setPhotoUrl(null);
        setIsDeleteOpen(false);
    };

    return (
        <div className={css.photo}>
            <div className={css.avatar}>
                {photoUrl ? (
                    <>
                        {/* Обычный <img>: next/image не работает с временными ссылками blob: */}
                        <img src={photoUrl} alt="Avatar" className={css.image} />

                        <button
                            type="button"
                            className={css.delete}
                            aria-label="Delete photo"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <Image
                                src={closeOutline}
                                alt=""
                                width={CLOSE_ICON_SIZE}
                                height={CLOSE_ICON_SIZE}
                            />
                        </button>
                    </>
                ) : (
                    <Image
                        src={imageOutline}
                        alt=""
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                    />
                )}
            </div>

            <Button variant="outlined" onClick={() => setIsAddOpen(true)}>
                Select Profile Photo
            </Button>

            <AddPhotoModal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={savePhoto}
            />

            <DeletePhotoModal
                open={isDeleteOpen}
                onConfirm={deletePhoto}
                onClose={() => setIsDeleteOpen(false)}
            />
        </div>
    );
};
