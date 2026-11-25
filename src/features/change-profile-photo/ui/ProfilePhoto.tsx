'use client';

import { useState } from 'react';

import Image from 'next/image';

import { normalizeAvatarUploadError, normalizeProfileError } from '@/entities/profile';
import imageOutline from '@/shared/assets/image-outline.svg';
import { Button } from '@/shared/ui/button';

import closeOutline from '../assets/close-outline.svg';
import { useDeleteAvatar } from '../model/useDeleteAvatar';
import { useUploadAvatar } from '../model/useUploadAvatar';

import { AddPhotoModal } from './AddPhotoModal';
import { DeletePhotoModal } from './DeletePhotoModal';
import css from './profile-photo.module.scss';

const ICON_SIZE = 48;
const CLOSE_ICON_SIZE = 16;

type ProfilePhotoProps = {
    // Аватар с сервера — поле avatar из ProfileResponseDto (не avatarUrl:
    // то имя только у ответа загрузки). Пока проп не передан, показываем
    // заглушку; реальные данные подключит задача 10.
    avatar?: string | null;
};

// Аватарка, кнопка загрузки и крестик удаления.
// Источник показа: свежий blob только что загруженного фото, иначе avatar
// с сервера, иначе заглушка.
export const ProfilePhoto = ({ avatar = null }: ProfilePhotoProps): React.JSX.Element => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { mutateAsync: uploadAvatar } = useUploadAvatar();
    const {
        mutateAsync: deleteAvatar,
        isPending: isDeleting,
        error: deleteError,
        reset: resetDeleteError,
    } = useDeleteAvatar();

    // Свежий blob важнее серверного аватара: после загрузки профиль ещё
    // не перезапрошен, а пользователь должен сразу увидеть новое фото
    const displayedUrl = photoUrl ?? avatar;

    const deleteErrorText = deleteError
        ? normalizeProfileError(deleteError)[0]?.message ?? null
        : null;

    const savePhoto = async (photo: Blob): Promise<void> => {
        try {
            await uploadAvatar(photo);
        } catch (error) {
            // Текст по коду ответа (400/401/403/404/413) готовит entity
            throw new Error(normalizeAvatarUploadError(error));
        }

        // Старая временная ссылка больше не нужна, освобождаем память
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }

        setPhotoUrl(URL.createObjectURL(photo));
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        try {
            // PUT /api/v1/profile с avatar: null. Инвалидацию кэша делает хук
            await deleteAvatar();
        } catch {
            // Ошибка уже в deleteError — показываем её в окне подтверждения
            return;
        }

        // Успех: локальный blob больше не нужен, серверный avatar придёт
        // из пропа после перезапроса профиля
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }

        setPhotoUrl(null);
        setIsDeleteOpen(false);
    };

    const handleDeleteClose = (): void => {
        if (isDeleting) return; // нельзя закрыть во время запроса

        resetDeleteError();
        setIsDeleteOpen(false);
    };

    return (
        <div className={css.photo}>
            <div className={css.avatar}>
                {displayedUrl ? (
                    <>
                        {/* Обычный <img>: next/image не работает с временными ссылками blob: */}
                        <img src={displayedUrl} alt="Avatar" className={css.image} />

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
                isPending={isDeleting}
                errorText={deleteErrorText}
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteClose}
                onDismissError={resetDeleteError}
            />
        </div>
    );
};
