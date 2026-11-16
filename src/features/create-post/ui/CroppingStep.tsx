'use client';

import { useState } from 'react';

import { useObjectUrl } from '@/shared/hooks';
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

// Одновременно может быть открыто только одно меню
type OpenMenu = 'aspect' | 'zoom' | 'gallery' | null;

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

    const photo = photos[currentIndex];
    const photoUrl = useObjectUrl(photo.originalFile);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === photos.length - 1;

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
                        open={openMenu === 'aspect'}
                        onOpenChange={isOpen => setOpenMenu(isOpen ? 'aspect' : null)}
                    >
                        <AspectMenu value={aspect} onChange={onAspectChange} />
                    </Popover>
                </div>

                <div className={css.control}>
                    <Popover
                        trigger={openMenu === 'zoom' ? <ZoomFilledIcon /> : <ZoomIcon />}
                        triggerLabel="Zoom"
                        triggerClassName={css.button}
                        open={openMenu === 'zoom'}
                        onOpenChange={isOpen => setOpenMenu(isOpen ? 'zoom' : null)}
                    >
                        <ZoomSlider
                            value={photo.cropSettings.zoom}
                            onChange={zoom => onCropSettingsChange(photo.id, { zoom })}
                        />
                    </Popover>
                </div>
            </div>

            {/* Кнопка галереи справа внизу, панель открывается над ней и прижата вправо */}

            <div className={css.gallery}>
                <Popover
                    trigger={<ImageIcon />}
                    triggerLabel="Gallery"
                    triggerClassName={css.button}
                    align="end"
                    open={openMenu === 'gallery'}
                    onOpenChange={isOpen => setOpenMenu(isOpen ? 'gallery' : null)}
                >
                    <PhotoGallery
                        photos={photos}
                        onShow={onShowPhoto}
                        onAdd={onAddPhoto}
                        onRemove={onRemovePhoto}
                    />
                </Popover>
            </div>
        </div>
    );
};
