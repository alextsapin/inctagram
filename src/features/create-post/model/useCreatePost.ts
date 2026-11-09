import { useState } from 'react';

import type {
    CreatePostPhoto,
    CreatePostState,
    CreatePostStep,
    DraftPhoto,
    PostDraft,
} from './types';

const INITIAL_STATE: CreatePostState = {
    step: 'add-photo',
    photos: [],
    description: '',
};

type UseCreatePost = {
    state: CreatePostState;
    goToStep: (step: CreatePostStep) => void;
    selectPhoto: (file: File) => void;
    openDraft: (draft: PostDraft) => void;
};

// В черновике фото лежит как Blob, а пост хранит исходное фото как File.
// Обычно из IndexedDB возвращается тот же File, но на всякий случай оборачиваем Blob в File
const toFile = (draftPhoto: DraftPhoto): File =>
    draftPhoto.file instanceof File
        ? draftPhoto.file
        : new File([draftPhoto.file], 'draft-photo', { type: draftPhoto.file.type });

// Хранит общее состояние окна создания поста
export const useCreatePost = (): UseCreatePost => {
    const [state, setState] = useState<CreatePostState>(INITIAL_STATE);

    const goToStep = (step: CreatePostStep): void => {
        setState(prev => ({ ...prev, step }));
    };

    // Фото выбрано на шаге Add Photo: начинаем пост заново с этим фото и открываем обрезку.
    // Заменяем список целиком, а не добавляем: на Add Photo можно вернуться стрелкой «Назад»,
    // и тогда старое фото не должно остаться в посте. Добавлять фото будет галерея (задача 5).
    // Обрезки и фильтра у нового фото ещё нет, поэтому там null
    const selectPhoto = (file: File): void => {
        const photo: CreatePostPhoto = {
            id: crypto.randomUUID(), // уникальный id, чтобы отличать фото друг от друга
            originalFile: file,
            croppedFile: null,
            cropSettings: null,
            filter: null,
            filteredFile: null,
        };

        setState(prev => ({ ...prev, photos: [photo], step: 'cropping' }));
    };

    // Open Draft: берём фото, фильтры и описание из черновика и открываем шаг Cropping.
    // Обрезку черновик не хранит (задача 9), поэтому пользователь делает её заново
    const openDraft = (draft: PostDraft): void => {
        const photos: CreatePostPhoto[] = draft.photos.map(draftPhoto => ({
            id: draftPhoto.id,
            originalFile: toFile(draftPhoto),
            croppedFile: null,
            cropSettings: null,
            filter: draftPhoto.filter,
            filteredFile: null,
        }));

        setState({ step: 'cropping', photos, description: draft.description });
    };

    return { state, goToStep, selectPhoto, openDraft };
};
