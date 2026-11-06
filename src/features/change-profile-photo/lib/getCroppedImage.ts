import type { Area } from 'react-easy-crop';

// Качество JPEG от 0 до 1: 0.9 почти не отличить от оригинала, а файл заметно меньше
const JPEG_QUALITY = 0.9;

// react-easy-crop только сообщает, какую область выбрал пользователь (area, в пикселях).
// Саму картинку вырезаем здесь: рисуем эту область на <canvas> и получаем файл (Blob).
// type — формат исходного файла, чтобы у PNG не пропала прозрачность
export const getCroppedImage = async (
    imageUrl: string,
    area: Area,
    type: string,
): Promise<Blob> => {
    // Загружаем фото по ссылке и ждём, пока браузер его прочитает.
    // Если файл повреждён, decode() выбросит ошибку, и окно покажет её пользователю
    const image = new Image();

    image.src = imageUrl;
    await image.decode();

    const canvas = document.createElement('canvas');

    canvas.width = area.width;
    canvas.height = area.height;

    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Canvas is not supported');
    }

    // Берём из картинки прямоугольник area и рисуем его в canvas с левого верхнего угла
    context.drawImage(
        image,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        area.width,
        area.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to crop image'));
                }
            },
            type,
            JPEG_QUALITY,
        );
    });
};
