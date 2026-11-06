const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * KILOBYTE;
const MAX_PHOTO_SIZE_MB = 10;

export const ALLOWED_PHOTO_TYPES = ['image/png', 'image/jpeg'];

// Проверяет выбранный файл. Возвращает текст ошибки из макета или null, если файл подходит.
// accept у <input> только подсказывает браузеру, какие файлы показать:
// в окне выбора можно переключиться на «Все файлы», поэтому проверяем ещё раз здесь
export const validatePhoto = (file: File): string | null => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        return 'The format of the uploaded photo must be PNG and JPEG';
    }

    if (file.size > MAX_PHOTO_SIZE_MB * MEGABYTE) {
        return `Photo size must be less than ${MAX_PHOTO_SIZE_MB} MB!`;
    }

    return null;
};
