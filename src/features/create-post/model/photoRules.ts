import type { PhotoRules } from '@/shared/lib';

// Правила для фото поста. Одни и те же для шага Add Photo и для плюса в галерее
const POST_MAX_SIZE_MB = 20;

// У постов в ТЗ один текст на обе ошибки: и про формат, и про размер
export const POST_PHOTO_ERROR = `The photo must be less than ${POST_MAX_SIZE_MB} Mb and have JPEG or PNG format`;

export const POST_PHOTO_RULES: PhotoRules = {
    maxSizeMb: POST_MAX_SIZE_MB,
    formatError: POST_PHOTO_ERROR,
    sizeError: POST_PHOTO_ERROR,
};

// Сколько фото можно добавить в один пост
export const MAX_PHOTOS = 10;
