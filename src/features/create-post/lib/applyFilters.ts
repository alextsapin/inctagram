import type { CreatePostPhoto } from '../model/types';

import { ccgram } from './filters';

// Качество JPEG как при обрезке (getCroppedImage). Без него Chrome сохраняет файл
// почти без сжатия, и он выходит в несколько раз тяжелее. Для PNG не используется
const FILTERED_PHOTO_QUALITY = 0.9;

// Рисует фильтр в сам файл и возвращает готовые файлы в том же порядке, что и фото.
// На экране фильтр был только CSS-стилем, а на сервер должно уйти фото уже с фильтром
export const applyFilters = (photos: CreatePostPhoto[]): Promise<Blob[]> =>
    Promise.all(
        photos.map(async photo => {
            // После шага Cropping обрезанный файл есть у каждого фото.
            // originalFile — запасной вариант, чтобы не работать с null
            const file = photo.croppedFile ?? photo.originalFile;

            // Без фильтра отдаём файл как есть: перерисовка изменила бы фото и его размер
            if (photo.filter === null) return file;

            // getBlob работает с картинкой, поэтому делаем её из файла по временной ссылке
            const url = URL.createObjectURL(file);

            try {
                const image = new Image();

                image.src = url;

                // Формат тот же, что у обрезанного файла: JPEG остаётся JPEG, PNG остаётся PNG
                const filteredFile = await ccgram.getBlob(image, {
                    filter: photo.filter,
                    type: file.type,
                    quality: FILTERED_PHOTO_QUALITY,
                });

                if (!filteredFile) throw new Error('Failed to apply the filter');

                return filteredFile;
            } finally {
                URL.revokeObjectURL(url);
            }
        }),
    );
