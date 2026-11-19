import type { PhotoRules } from '@/shared/lib';

// Правила для фото поста. Одни и те же для шага Add Photo и для плюса в галерее.
// В ТЗ лимит 20 МБ, но с бэкендом договорились на 1 МБ на файл:
// файл больше 1 МБ бэкенд не принимает и отвечает 413
const POST_MAX_SIZE_MB = 1;

// Тот же лимит в байтах: 1 МБ = 1024 × 1024 байт, так же считает validatePhoto
const KILOBYTE = 1024;

export const POST_MAX_SIZE_BYTES = POST_MAX_SIZE_MB * KILOBYTE * KILOBYTE;

// У постов в ТЗ один текст на обе ошибки: и про формат, и про размер
export const POST_PHOTO_ERROR = `The photo must be less than ${POST_MAX_SIZE_MB} Mb and have JPEG or PNG format`;

export const POST_PHOTO_RULES: PhotoRules = {
    maxSizeMb: POST_MAX_SIZE_MB,
    formatError: POST_PHOTO_ERROR,
    sizeError: POST_PHOTO_ERROR,
};

// Сколько фото можно добавить в один пост
export const MAX_PHOTOS = 10;
