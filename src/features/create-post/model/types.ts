import type { Area, Point } from 'react-easy-crop';

// Шаги окна создания поста
export type CreatePostStep = 'add-photo' | 'cropping' | 'filters' | 'publication';

// Пропорции рамки обрезки. Original — пропорции первого фото
export type CropAspect = 'original' | '1:1' | '4:5' | '16:9';

// Настройки обрезки одного фото: сдвиг, приближение и выбранная область.
// area равна null, пока пользователь не открыл фото на шаге Cropping
export type CropSettings = {
    crop: Point;
    zoom: number;
    area: Area | null;
};

export type CreatePostPhoto = {
    id: string;
    originalFile: File; // файл, который выбрал пользователь
    width: number; // ширина исходного фото в пикселях, нужна для пропорций Original
    height: number; // высота исходного фото в пикселях
    croppedFile: Blob | null; // файл после обрезки
    cropSettings: CropSettings;
    filter: string | null; // название фильтра
    filteredFile: Blob | null; // файл с фильтром, он уходит на сервер
};

// Общее состояние окна: его читают и меняют все шаги
export type CreatePostState = {
    step: CreatePostStep;
    photos: CreatePostPhoto[];
    currentIndex: number; // номер фото, которое сейчас на экране
    aspect: CropAspect; // одни пропорции на весь пост, как в Instagram
    description: string;
};

// Фото в черновике: файл хранится как есть (Blob), фильтр отдельной строкой
export type DraftPhoto = {
    id: string;
    file: Blob; // фото без фильтра: File после выбора или Blob после обрезки
    filter: string | null; // название фильтра cc-gram, null = без фильтра
};

// Черновик поста: один на пользователя, ключ в IndexedDB — userId
export type PostDraft = {
    photos: DraftPhoto[];
    description: string;
};
