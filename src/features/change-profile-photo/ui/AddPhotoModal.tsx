'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import type { Area, Point } from 'react-easy-crop';

import imageOutline from '@/shared/assets/image-outline.svg';
import {
    ALLOWED_PHOTO_TYPES,
    getCroppedImage,
    type PhotoRules,
    validatePhoto,
} from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { PhotoCropper } from '@/shared/ui/photo-cropper';

import css from './add-photo-modal.module.scss';

const ADD_PHOTO_MODAL_WIDTH = 492;
const ICON_SIZE = 48;
const AVATAR_MAX_SIZE_MB = 10;
const INITIAL_CROP: Point = { x: 0, y: 0 }; // фото по центру, без сдвига
const INITIAL_ZOOM = 1; // без приближения

// Правила для аватара: у каждой ошибки свой текст из макета
const AVATAR_PHOTO_RULES: PhotoRules = {
    maxSizeMb: AVATAR_MAX_SIZE_MB,
    formatError: 'The format of the uploaded photo must be PNG and JPEG',
    sizeError: `Photo size must be less than ${AVATAR_MAX_SIZE_MB} MB!`,
};

type SelectedPhoto = {
    url: string; // временная ссылка на файл из URL.createObjectURL
    type: string; // image/png или image/jpeg
};

type AddPhotoModalProps = {
    open: boolean;
    onClose: () => void;
    // Получает уже обрезанное фото
    onSave: (photo: Blob) => void;
};

export const AddPhotoModal = ({
    open,
    onClose,
    onSave,
}: AddPhotoModalProps): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    // Сдвиг и приближение фото под кругом. PhotoCropper их не хранит, поэтому храним здесь
    const [crop, setCrop] = useState<Point>(INITIAL_CROP);
    const [zoom, setZoom] = useState(INITIAL_ZOOM);

    // Окно закрывается: всё сбрасываем, чтобы в следующий раз оно открылось пустым.
    // revokeObjectURL освобождает память, которую браузер держал под временную ссылку
    const handleClose = (): void => {
        if (photo) {
            URL.revokeObjectURL(photo.url);
        }

        // Окно после закрытия остаётся на странице вместе с полем выбора файла,
        // и поле помнит последний файл. Если его не очистить, после повторного открытия
        // тот же файл выбрать не получится: браузер не сообщит о выборе, раз файл не изменился
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        setPhoto(null);
        setError(null);
        setCroppedArea(null);
        setCrop(INITIAL_CROP);
        setZoom(INITIAL_ZOOM);
        onClose();
    };

    // Кнопка «Select from Computer» нажимает спрятанный <input type="file">
    const openFileDialog = (): void => {
        inputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];

        if (!file) return;

        const validationError = validatePhoto(file, AVATAR_PHOTO_RULES);

        if (validationError) {
            setError(validationError);

            return;
        }

        setError(null);
        setPhoto({ url: URL.createObjectURL(file), type: file.type });
    };

    const handleSave = async (): Promise<void> => {
        // Кнопка Save видна только с фото, а croppedArea появляется через мгновение,
        // как только фото отрисовалось под кругом. Проверка нужна и для TypeScript
        if (!photo || !croppedArea) return;

        try {
            const croppedPhoto = await getCroppedImage(
                photo.url,
                croppedArea,
                photo.type,
            );

            onSave(croppedPhoto);
            handleClose();
        } catch {
            setError('Failed to save the photo. Please try again');
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Add a Profile Photo"
            width={ADD_PHOTO_MODAL_WIDTH}
            // Кнопка Save есть только после выбора фото
            actions={photo && <Button onClick={handleSave}>Save</Button>}
        >
            <div className={css.content}>
                {error && (
                    <p className={css.error} role="alert">
                        <b>Error!</b> {error}
                    </p>
                )}

                {photo ? (
                    <div className={css.crop}>
                        <PhotoCropper
                            image={photo.url}
                            crop={crop}
                            zoom={zoom}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={setCroppedArea}
                            cropShape="round"
                            className={css.cropper}
                        />
                    </div>
                ) : (
                    <>
                        <div className={css.placeholder}>
                            <Image
                                src={imageOutline}
                                alt=""
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                            />
                        </div>

                        <Button onClick={openFileDialog}>Select from Computer</Button>

                        <input
                            ref={inputRef}
                            type="file"
                            accept={ALLOWED_PHOTO_TYPES.join(', ')}
                            className={css.input}
                            onChange={handleFileChange}
                        />
                    </>
                )}
            </div>
        </Modal>
    );
};
