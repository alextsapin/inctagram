'use client';

import Cropper, { type Area, type Point } from 'react-easy-crop';

import css from './photo-cropper.module.scss';

type PhotoCropperProps = {
    image: string; // ссылка на фото, например из URL.createObjectURL
    // Сдвиг и приближение хранит родитель, а компонент только сообщает новые значения.
    // Так они не теряются, когда компонент пропадает с экрана: переключили фото
    // или ушли на другой шаг и вернулись
    crop: Point;
    zoom: number;
    onCropChange: (crop: Point) => void;
    onZoomChange: (zoom: number) => void;
    // Вызывается, когда пользователь отпустил фото: отдаёт выбранную область в пикселях
    onCropComplete: (area: Area) => void;
    aspect?: number; // пропорции рамки: 1 — квадрат, 4 / 5 — вертикальный прямоугольник
    cropShape?: 'rect' | 'round'; // форма рамки: прямоугольник или круг, как у аватара
    // Как фото встаёт в область: 'cover' растягивает его на всю область,
    // 'contain' показывает целиком, и тогда при зуме 1 в рамку попадает максимум фото
    objectFit?: 'cover' | 'contain';
    className?: string; // размеры области с фото задаёт родитель
};

// Фото под рамкой обрезки: его можно двигать мышью, пальцем или стрелками
// и приближать колесом мыши или двумя пальцами, до 3 раз (так по умолчанию в библиотеке)
export const PhotoCropper = ({
    image,
    crop,
    zoom,
    onCropChange,
    onZoomChange,
    onCropComplete,
    aspect = 1,
    cropShape = 'rect',
    objectFit = 'cover',
    className,
}: PhotoCropperProps): React.JSX.Element => {
    const cropperClass = [css.cropper, className].filter(Boolean).join(' ');

    return (
        <div className={cropperClass}>
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={cropShape}
                objectFit={objectFit}
                showGrid={false}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={(_area, areaPixels) => onCropComplete(areaPixels)}
                classes={{ cropAreaClassName: css['crop-area'] }}
            />
        </div>
    );
};
