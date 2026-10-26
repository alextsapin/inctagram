'use client';

import { useState } from 'react';

import Cropper, { type Area, type Point } from 'react-easy-crop';

import css from './photo-cropper.module.scss';

type PhotoCropperProps = {
    image: string;
    // Вызывается, когда пользователь отпустил фото: отдаёт выбранную область в пикселях
    onCropComplete: (area: Area) => void;
};

// Фото под круглой маской: его можно двигать мышью, пальцем или стрелками
// и приближать колесом мыши или двумя пальцами, до 3 раз (так по умолчанию в библиотеке)
export const PhotoCropper = ({
    image,
    onCropComplete,
}: PhotoCropperProps): React.JSX.Element => {
    // crop — сдвиг фото, zoom — приближение. Библиотека только сообщает новые значения,
    // а хранить их должны мы
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    return (
        <div className={css.cropper}>
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                // Фото заполняет всю область, как в макете
                objectFit="cover"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, areaPixels) => onCropComplete(areaPixels)}
                classes={{ cropAreaClassName: css['crop-area'] }}
            />
        </div>
    );
};
