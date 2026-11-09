const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * KILOBYTE;

// Форматы фото, которые принимаем и для аватара, и для постов
export const ALLOWED_PHOTO_TYPES = ['image/png', 'image/jpeg'];

// У аватара и у постов разный лимит размера и разные тексты ошибок,
// поэтому их передаёт тот, кто вызывает проверку
export type PhotoRules = {
    maxSizeMb: number;
    formatError: string; // текст, если файл не PNG и не JPEG
    sizeError: string; // текст, если файл не меньше лимита
};

// Проверяет выбранный файл. Возвращает текст ошибки или null, если файл подходит.
// accept у <input> только подсказывает браузеру, какие файлы показать:
// в окне выбора можно переключиться на «Все файлы», поэтому проверяем ещё раз здесь
export const validatePhoto = (file: File, rules: PhotoRules): string | null => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        return rules.formatError;
    }

    // Файл должен быть строго меньше лимита, как в текстах ошибок: «less than 20 Mb»
    if (file.size >= rules.maxSizeMb * MEGABYTE) {
        return rules.sizeError;
    }

    return null;
};
