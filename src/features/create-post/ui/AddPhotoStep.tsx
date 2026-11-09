'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';

import imageOutline from '@/shared/assets/image-outline.svg';
import { ALLOWED_PHOTO_TYPES, validatePhoto } from '@/shared/lib';
import { Button } from '@/shared/ui/button';

import { POST_PHOTO_ERROR, POST_PHOTO_RULES } from '../model/photoRules';

import css from './add-photo-step.module.scss';

const ICON_SIZE = 48;

type AddPhotoStepProps = {
    // Получает файл, который уже прошёл проверку. Выбрасывает ошибку, если файл не открылся
    onSelect: (file: File) => Promise<void>;
    // Открывает сохранённый черновик. Передаётся, только если черновик есть:
    // без него кнопки Open Draft на экране нет
    onOpenDraft?: () => void;
};

// Первый шаг окна создания поста: выбор фото с компьютера или открытие черновика
export const AddPhotoStep = ({
    onSelect,
    onOpenDraft,
}: AddPhotoStepProps): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Кнопка «Select from Computer» нажимает спрятанный <input type="file">
    const openFileDialog = (): void => {
        inputRef.current?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const file = event.target.files?.[0];

        if (!file) return;

        const validationError = validatePhoto(file, POST_PHOTO_RULES);

        // Файл не подошёл: показываем ошибку и остаёмся на этом шаге
        if (validationError) {
            setError(validationError);

            return;
        }

        // Формат подходит, но файл может оказаться повреждённым и не открыться.
        // Тогда показываем ту же ошибку: для пользователя это тоже неподходящий файл
        try {
            await onSelect(file);
        } catch {
            setError(POST_PHOTO_ERROR);
        }
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

                {onOpenDraft && (
                    <Button variant="outlined" fullWidth onClick={onOpenDraft}>
                        Open Draft
                    </Button>
                )}
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
