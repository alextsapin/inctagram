'use client';

import { useRef, useState } from 'react';

import { useCloseOnOutsideClick, useObjectUrl } from '@/shared/hooks';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ExpandIcon,
    ImageIcon,
    ZoomFilledIcon,
    ZoomIcon,
} from '@/shared/ui/icons';
import { PhotoCropper } from '@/shared/ui/photo-cropper';
import { Popover } from '@/shared/ui/popover';

import type { CreatePostPhoto, CropAspect, CropSettings } from '../model/types';

import { AspectMenu } from './AspectMenu';
import css from './cropping-step.module.scss';
import { PhotoGallery } from './PhotoGallery';
import { ZoomSlider } from './ZoomSlider';

// Какое из временных меню сейчас открыто над кнопками: ползунок, галерея или никакое
type OpenMenu = 'zoom' | 'gallery' | null;

type CroppingStepProps = {
    photos: CreatePostPhoto[]; // все фото поста
    currentIndex: number; // номер фото, которое сейчас обрезаем
    aspect: CropAspect; // выбранный пункт в меню пропорций
    aspectRatio: number; // те же пропорции числом, для рамки
    onAspectChange: (aspect: CropAspect) => void;
    onCropSettingsChange: (photoId: string, changes: Partial<CropSettings>) => void;
    onShowPhoto: (index: number) => void;
    onAddPhoto: (file: File) => void;
    onRemovePhoto: (photoId: string) => void;
};

// Второй шаг окна создания поста: фото под рамкой обрезки, стрелки между фото
// и кнопки пропорций, приближения и галереи
export const CroppingStep = ({
    photos,
    currentIndex,
    aspect,
    aspectRatio,
    onAspectChange,
    onCropSettingsChange,
    onShowPhoto,
    onAddPhoto,
    onRemovePhoto,
}: CroppingStepProps): React.JSX.Element => {
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const zoomRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const photo = photos[currentIndex];
    const photoUrl = useObjectUrl(photo.originalFile);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === photos.length - 1;

    const closeMenu = (): void => setOpenMenu(null);

    // Повторное нажатие на кнопку закрывает её меню, нажатие на другую открывает другое
    const toggleMenu = (menu: OpenMenu): void => {
        setOpenMenu(prev => (prev === menu ? null : menu));
    };

    // Класс кнопки: у кнопки открытого меню синяя иконка
    const getButtonClass = (menu: OpenMenu): string =>
        openMenu === menu ? `${css.button} ${css.active}` : css.button;

    // TODO: заменить открытие меню на Popover из задачи BLD-113, когда он появится.
    // Сейчас это временная заглушка: openMenu и закрытие по клику мимо или Escape
    useCloseOnOutsideClick(zoomRef, openMenu === 'zoom', closeMenu);
    useCloseOnOutsideClick(galleryRef, openMenu === 'gallery', closeMenu);

    return (
        <div className={css.step}>
            {/* key: для каждого фото свой кропер. Так при переключении фото кропер
                не перенесёт сдвиг и приближение прошлого фото на новое */}
            {photoUrl && (
                <PhotoCropper
                    key={photo.id}
                    image={photoUrl}
                    crop={photo.cropSettings.crop}
                    zoom={photo.cropSettings.zoom}
                    aspect={aspectRatio}
                    // Фото целиком: иначе в Original и 16:9 рамка захватывает только середину
                    objectFit="contain"
                    onCropChange={crop => onCropSettingsChange(photo.id, { crop })}
                    onZoomChange={zoom => onCropSettingsChange(photo.id, { zoom })}
                    onCropComplete={area => onCropSettingsChange(photo.id, { area })}
                    className={css.cropper}
                />
            )}

            {/* Стрелки по кругу не ходят: на первом фото нет «назад», на последнем нет «вперёд» */}
            {!isFirst && (
                <button
                    type="button"
                    className={`${css.button} ${css.arrow} ${css.prev}`}
                    aria-label="Previous photo"
                    onClick={() => onShowPhoto(currentIndex - 1)}
                >
                    <ArrowLeftIcon />
                </button>
            )}

            {!isLast && (
                <button
                    type="button"
                    className={`${css.button} ${css.arrow} ${css.next}`}
                    aria-label="Next photo"
                    onClick={() => onShowPhoto(currentIndex + 1)}
                >
                    <ArrowRightIcon />
                </button>
            )}

            {/* Точки только показывают, какое фото на экране. Для одного фото они не нужны */}
            {photos.length > 1 && (
                <div className={css.dots} aria-hidden="true">
                    {photos.map((item, index) => (
                        <span
                            key={item.id}
                            className={
                                index === currentIndex
                                    ? `${css.dot} ${css.current}`
                                    : css.dot
                            }
                        />
                    ))}
                </div>
            )}

            <div className={css.controls}>
                <div className={css.control}>
                    <Popover
                        trigger={<ExpandIcon />}
                        triggerLabel="Aspect ratio"
                        triggerClassName={css.button}
                    >
                        <AspectMenu value={aspect} onChange={onAspectChange} />
                    </Popover>
                </div>

                <div ref={zoomRef} className={css.control}>
                    {/* TODO: заменить на Popover из задачи BLD-113 */}
                    {openMenu === 'zoom' && (
                        <div className={css.menu}>
                            <ZoomSlider
                                value={photo.cropSettings.zoom}
                                onChange={zoom =>
                                    onCropSettingsChange(photo.id, { zoom })
                                }
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        className={getButtonClass('zoom')}
                        aria-label="Zoom"
                        aria-expanded={openMenu === 'zoom'}
                        onClick={() => toggleMenu('zoom')}
                    >
                        {openMenu === 'zoom' ? <ZoomFilledIcon /> : <ZoomIcon />}
                    </button>
                </div>
            </div>

            {/* Кнопка галереи справа внизу, панель открывается над ней и прижата вправо */}
            <div ref={galleryRef} className={css.gallery}>
                {/* TODO: заменить на Popover из задачи BLD-113 */}
                {openMenu === 'gallery' && (
                    <div className={`${css.menu} ${css['menu-right']}`}>
                        <PhotoGallery
                            photos={photos}
                            onShow={onShowPhoto}
                            onAdd={onAddPhoto}
                            onRemove={onRemovePhoto}
                        />
                    </div>
                )}

                <button
                    type="button"
                    className={getButtonClass('gallery')}
                    aria-label="Gallery"
                    aria-expanded={openMenu === 'gallery'}
                    onClick={() => toggleMenu('gallery')}
                >
                    <ImageIcon />
                </button>
            </div>
        </div>
    );
};
