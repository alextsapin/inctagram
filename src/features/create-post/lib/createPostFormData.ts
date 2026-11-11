import type { CreatePostPhoto } from '../model/types';

// Имя файла в запросе: сервер ждёт файлы с именем, а не безымянные данные
const getFileName = (file: Blob, index: number): string => {
    const extension = file.type === 'image/png' ? 'png' : 'jpg';

    return `photo-${index + 1}.${extension}`;
};

// Собирает FormData для публикации: описание и фото уже с фильтрами.
// Content-Type вручную не ставим: для FormData его задаёт axios
export const createPostFormData = (
    photos: CreatePostPhoto[],
    description: string,
): FormData => {
    const formData = new FormData();

    formData.append('description', description);

    photos.forEach((photo, index) => {
        // После шага Filters файл с фильтром есть у каждого фото.
        // Остальные варианты на всякий случай, чтобы не работать с null
        const file = photo.filteredFile ?? photo.croppedFile ?? photo.originalFile;

        // TODO: бэкенд ждёт фото в поле photos, а мок задачи «API постов» пока читает files.
        // Поменять имя поля, когда API постов переведут на настоящий запрос
        formData.append('files', file, getFileName(file, index));
    });

    return formData;
};
