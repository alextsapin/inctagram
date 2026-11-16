import type { CreatePostPhoto, PostDraft } from '../model/types';

// Черновик из состояния окна: исходные фото, названия их фильтров и описание.
// Фото кладём без обрезки и без фильтра, как договорились в задаче «Черновик»:
// при открытии черновика обрезка начинается заново, а фильтр ставится по названию
export const createDraft = (
    photos: CreatePostPhoto[],
    description: string,
): PostDraft => ({
    photos: photos.map(photo => ({
        id: photo.id,
        file: photo.originalFile,
        filter: photo.filter,
    })),
    description,
});
