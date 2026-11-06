import type { CreatePostStep } from './types';

const SMALL_WINDOW_WIDTH = 492;
const LARGE_WINDOW_WIDTH = 972;

type StepSettings = {
    title: string;
    width: number;
    back: CreatePostStep | null; // куда ведёт стрелка «Назад»
    next: CreatePostStep | null; // куда ведёт Next
};

// Настройки всех шагов в одном месте: заголовок, ширина и соседние шаги
export const STEP_SETTINGS: Record<CreatePostStep, StepSettings> = {
    'add-photo': {
        title: 'Add Photo',
        width: SMALL_WINDOW_WIDTH,
        back: null,
        next: 'cropping',
    },
    cropping: {
        title: 'Cropping',
        width: SMALL_WINDOW_WIDTH,
        back: 'add-photo',
        next: 'filters',
    },
    filters: {
        title: 'Filters',
        width: LARGE_WINDOW_WIDTH,
        back: 'cropping',
        next: 'publication',
    },
    publication: {
        title: 'Publication',
        width: LARGE_WINDOW_WIDTH,
        back: 'filters',
        next: null,
    },
};
