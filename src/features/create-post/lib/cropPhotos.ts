import type { Area } from 'react-easy-crop';

import { getCroppedImage } from '@/shared/lib';

import type { CreatePostPhoto } from '../model/types';

// Лишнее делим пополам между двумя сторонами, чтобы рамка встала по центру
const HALF = 2;

// Самая большая область с нужными пропорциями точно по центру фото.
// Нужна для фото, которые пользователь не открывал на шаге Cropping:
// у них ещё нет выбранной области
const getCenteredArea = (photo: CreatePostPhoto, aspectRatio: number): Area => {
    const photoRatio = photo.width / photo.height;

    // Фото шире рамки: берём всю высоту и обрезаем бока
    if (photoRatio > aspectRatio) {
        const width = photo.height * aspectRatio;

        return { x: (photo.width - width) / HALF, y: 0, width, height: photo.height };
    }

    // Фото уже рамки: берём всю ширину и обрезаем верх и низ
    const height = photo.width / aspectRatio;

    return { x: 0, y: (photo.height - height) / HALF, width: photo.width, height };
};

// Область обрезки приходит дробной, поэтому сравниваем с точностью до пикселя
const PIXEL_TOLERANCE = 1;

// Выбрано всё фото целиком: обрезать нечего
const isWholePhoto = (area: Area, photo: CreatePostPhoto): boolean =>
    Math.abs(area.x) <= PIXEL_TOLERANCE &&
    Math.abs(area.y) <= PIXEL_TOLERANCE &&
    Math.abs(area.width - photo.width) <= PIXEL_TOLERANCE &&
    Math.abs(area.height - photo.height) <= PIXEL_TOLERANCE;

// Вырезает из каждого фото выбранную область и возвращает готовые файлы в том же порядке
export const cropPhotos = (
    photos: CreatePostPhoto[],
    aspectRatio: number,
): Promise<Blob[]> =>
    Promise.all(
        photos.map(async photo => {
            const area = photo.cropSettings.area ?? getCenteredArea(photo, aspectRatio);

            // Фото не обрезали: отдаём исходный файл. Если перерисовать его на canvas,
            // браузер сохранит его заново, и файл станет тяжелее (PNG примерно на 17%)
            if (isWholePhoto(area, photo)) return photo.originalFile;

            // getCroppedImage читает фото по ссылке, поэтому создаём временную и потом освобождаем
            const url = URL.createObjectURL(photo.originalFile);

            try {
                return await getCroppedImage(url, area, photo.originalFile.type);
            } finally {
                URL.revokeObjectURL(url);
            }
        }),
    );
