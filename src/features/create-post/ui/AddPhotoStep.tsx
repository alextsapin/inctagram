'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';

import imageOutline from '@/shared/assets/image-outline.svg';
import { ALLOWED_PHOTO_TYPES, type PhotoRules, validatePhoto } from '@/shared/lib';
import { Button } from '@/shared/ui/button';

import css from './add-photo-step.module.scss';

const ICON_SIZE = 48;
const POST_MAX_SIZE_MB = 20;
const POST_PHOTO_ERROR = `The photo must be less than ${POST_MAX_SIZE_MB} Mb and have JPEG or PNG format`;

// У постов в ТЗ один текст на обе ошибки: и про формат, и про размер
const POST_PHOTO_RULES: PhotoRules = {
    maxSizeMb: POST_MAX_SIZE_MB,
    formatError: POST_PHOTO_ERROR,
    sizeError: POST_PHOTO_ERROR,
};

type AddPhotoStepProps = {
    // Получает файл, который уже прошёл проверку
    onSelect: (file: File) => void;
};

// Первый шаг окна создания поста: выбор фото с компьютера
export const AddPhotoStep = ({ onSelect }: AddPhotoStepProps): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Кнопка «Select from Computer» нажимает спрятанный <input type="file">
    const openFileDialog = (): void => {
        inputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];

        if (!file) return;

        const validationError = validatePhoto(file, POST_PHOTO_RULES);

        // Файл не подошёл: показываем ошибку и остаёмся на этом шаге
        if (validationError) {
            setError(validationError);

            return;
        }

        onSelect(file);
    };

    return (
        <div className={css.content}>
            {error && (
                <p className={css.error} role="alert">
                    <b>Error!</b> {error}
                </p>
            )}

            <div className={css.placeholder}>
                <Image src={imageOutline} alt="" width={ICON_SIZE} height={ICON_SIZE} />
            </div>

            <div className={css.buttons}>
                <Button fullWidth onClick={openFileDialog}>
                    Select from Computer
                </Button>

                {/* TODO: включить Open Draft, когда появится getDraft из задачи BLD-126.
                    Показывать, только если черновик есть. По клику открыть шаг Cropping с фото из черновика */}
                <Button variant="outlined" fullWidth disabled>
                    Open Draft
                </Button>
            </div>

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
