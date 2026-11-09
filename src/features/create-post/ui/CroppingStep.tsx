'use client';

import { useEffect, useRef, useState } from 'react';

import { useCloseOnOutsideClick } from '@/shared/hooks';
import { ExpandIcon, ZoomFilledIcon, ZoomIcon } from '@/shared/ui/icons';
import { PhotoCropper } from '@/shared/ui/photo-cropper';

import type { CreatePostPhoto, CropAspect, CropSettings } from '../model/types';

import { AspectMenu } from './AspectMenu';
import css from './cropping-step.module.scss';
import { ZoomSlider } from './ZoomSlider';

// Какое меню сейчас открыто над кнопками: пропорции, ползунок или никакое
type OpenMenu = 'aspect' | 'zoom' | null;

type CroppingStepProps = {
    photo: CreatePostPhoto; // фото, которое сейчас обрезаем
    aspect: CropAspect; // выбранный пункт в меню пропорций
    aspectRatio: number; // те же пропорции числом, для рамки
    onAspectChange: (aspect: CropAspect) => void;
    onCropSettingsChange: (changes: Partial<CropSettings>) => void;
};

// Второй шаг окна создания поста: фото под рамкой обрезки и кнопки пропорций и приближения
export const CroppingStep = ({
    photo,
    aspect,
    aspectRatio,
    onAspectChange,
    onCropSettingsChange,
}: CroppingStepProps): React.JSX.Element => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const aspectRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<HTMLDivElement>(null);

    // Временная ссылка на файл, чтобы показать фото. Создаём её в эффекте:
    // так браузер освобождает память, когда фото меняется или пользователь уходит с шага
    useEffect(() => {
        const url = URL.createObjectURL(photo.originalFile);

        setPhotoUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [photo.originalFile]);

    const closeMenu = (): void => setOpenMenu(null);

    // Повторное нажатие на кнопку закрывает её меню, нажатие на другую открывает другое
    const toggleMenu = (menu: OpenMenu): void => {
        setOpenMenu(prev => (prev === menu ? null : menu));
    };

    // TODO: заменить открытие меню на Popover из задачи BLD-113, когда он появится.
    // Сейчас это временная заглушка: openMenu и закрытие по клику мимо или Escape
    useCloseOnOutsideClick(aspectRef, openMenu === 'aspect', closeMenu);
    useCloseOnOutsideClick(zoomRef, openMenu === 'zoom', closeMenu);

    return (
        <div className={css.step}>
            {photoUrl && (
                <PhotoCropper
                    image={photoUrl}
                    crop={photo.cropSettings.crop}
                    zoom={photo.cropSettings.zoom}
                    aspect={aspectRatio}
                    // Фото целиком: иначе в Original и 16:9 рамка захватывает только середину
                    objectFit="contain"
                    onCropChange={crop => onCropSettingsChange({ crop })}
                    onZoomChange={zoom => onCropSettingsChange({ zoom })}
                    onCropComplete={area => onCropSettingsChange({ area })}
                    className={css.cropper}
                />
            )}

            <div className={css.controls}>
                <div ref={aspectRef} className={css.control}>
                    {/* TODO: заменить на Popover из задачи BLD-113 */}
                    {openMenu === 'aspect' && (
                        <div className={css.menu}>
                            <AspectMenu value={aspect} onChange={onAspectChange} />
                        </div>
                    )}

                    <button
                        type="button"
                        className={
                            openMenu === 'aspect'
                                ? `${css.button} ${css.active}`
                                : css.button
                        }
                        aria-label="Aspect ratio"
                        aria-expanded={openMenu === 'aspect'}
                        onClick={() => toggleMenu('aspect')}
                    >
                        <ExpandIcon />
                    </button>
                </div>

                <div ref={zoomRef} className={css.control}>
                    {/* TODO: заменить на Popover из задачи BLD-113 */}
                    {openMenu === 'zoom' && (
                        <div className={css.menu}>
                            <ZoomSlider
                                value={photo.cropSettings.zoom}
                                onChange={zoom => onCropSettingsChange({ zoom })}
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        className={
                            openMenu === 'zoom'
                                ? `${css.button} ${css.active}`
                                : css.button
                        }
                        aria-label="Zoom"
                        aria-expanded={openMenu === 'zoom'}
                        onClick={() => toggleMenu('zoom')}
                    >
                        {openMenu === 'zoom' ? <ZoomFilledIcon /> : <ZoomIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
};
