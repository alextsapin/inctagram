import type { Area, Point } from 'react-easy-crop';

// Шаги окна создания поста
export type CreatePostStep = 'add-photo' | 'cropping' | 'filters' | 'publication';

// Настройки обрезки одного фото: сдвиг, приближение и выбранная область
export type CropSettings = {
    crop: Point;
    zoom: number;
    area: Area | null;
};

export type CreatePostPhoto = {
    id: string;
    originalFile: File; // файл, который выбрал пользователь
    croppedFile: Blob | null; // файл после обрезки
    cropSettings: CropSettings | null;
    filter: string | null; // название фильтра
    filteredFile: Blob | null; // файл с фильтром, он уходит на сервер
};

// Общее состояние окна: его читают и меняют все шаги
export type CreatePostState = {
    step: CreatePostStep;
    photos: CreatePostPhoto[];
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
