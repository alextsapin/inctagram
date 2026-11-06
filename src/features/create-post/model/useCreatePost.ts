import { useState } from 'react';

import type { CreatePostState, CreatePostStep } from './types';

const INITIAL_STATE: CreatePostState = {
    step: 'add-photo',
    photos: [],
    description: '',
};

type UseCreatePost = {
    state: CreatePostState;
    goToStep: (step: CreatePostStep) => void;
};

// Хранит общее состояние окна создания поста
export const useCreatePost = (): UseCreatePost => {
    const [state, setState] = useState<CreatePostState>(INITIAL_STATE);

    const goToStep = (step: CreatePostStep): void => {
        setState(prev => ({ ...prev, step }));
    };

    return { state, goToStep };
};
