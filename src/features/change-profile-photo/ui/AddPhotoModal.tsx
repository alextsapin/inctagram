'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import type { Area } from 'react-easy-crop';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import imageOutline from '../assets/image-outline.svg';
import { getCroppedImage } from '../lib/getCroppedImage';
import { ALLOWED_PHOTO_TYPES, validatePhoto } from '../lib/validatePhoto';

import css from './add-photo-modal.module.scss';
import { PhotoCropper } from './PhotoCropper';

const ADD_PHOTO_MODAL_WIDTH = 492;
const ICON_SIZE = 48;

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

    // Окно закрывается: всё сбрасываем, чтобы в следующий раз оно открылось пустым.
    // revokeObjectURL освобождает память, которую браузер держал под временную ссылку
    const handleClose = (): void => {
        if (photo) {
            URL.revokeObjectURL(photo.url);
        }

        setPhoto(null);
        setError(null);
        setCroppedArea(null);
        onClose();
    };

    // Кнопка «Select from Computer» нажимает спрятанный <input type="file">
    const openFileDialog = (): void => {
        inputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];

        if (!file) return;

        const validationError = validatePhoto(file);

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
                        <PhotoCropper image={photo.url} onCropComplete={setCroppedArea} />
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
