import { useState } from 'react';

import type { CreatePostPhoto, CreatePostState, CreatePostStep } from './types';

const INITIAL_STATE: CreatePostState = {
    step: 'add-photo',
    photos: [],
    description: '',
};

type UseCreatePost = {
    state: CreatePostState;
    goToStep: (step: CreatePostStep) => void;
    selectPhoto: (file: File) => void;
};

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

    return { state, goToStep, selectPhoto };
};
