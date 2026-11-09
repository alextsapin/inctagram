import { useState } from 'react';

import { cropPhotos } from '../lib/cropPhotos';
import { readImageSize } from '../lib/readImageSize';

import { getAspectRatio } from './aspect';
import { MAX_PHOTOS } from './photoRules';
import type {
    CreatePostPhoto,
    CreatePostState,
    CreatePostStep,
    CropAspect,
    CropSettings,
    DraftPhoto,
    PostDraft,
} from './types';

const INITIAL_STATE: CreatePostState = {
    step: 'add-photo',
    photos: [],
    currentIndex: 0,
    aspect: 'original', // в макете по умолчанию выбран Original
    description: '',
};

// Фото по центру, без приближения, область ещё не выбрана
const INITIAL_CROP_SETTINGS: CropSettings = {
    crop: { x: 0, y: 0 },
    zoom: 1,
    area: null,
};

type UseCreatePost = {
    state: CreatePostState;
    goToStep: (step: CreatePostStep) => void;
    selectPhoto: (file: File) => Promise<void>;
    openDraft: (draft: PostDraft) => Promise<void>;
    showPhoto: (index: number) => void;
    addPhoto: (file: File) => Promise<void>;
    removePhoto: (photoId: string) => void;
    setAspect: (aspect: CropAspect) => void;
    updateCropSettings: (photoId: string, changes: Partial<CropSettings>) => void;
    cropAndContinue: () => Promise<void>;
};

// В черновике фото лежит как Blob, а пост хранит исходное фото как File.
// Обычно из IndexedDB возвращается тот же File, но на всякий случай оборачиваем Blob в File
const toFile = (draftPhoto: DraftPhoto): File =>
    draftPhoto.file instanceof File
        ? draftPhoto.file
        : new File([draftPhoto.file], 'draft-photo', { type: draftPhoto.file.type });

// Новое фото поста. Размеры узнаём сразу: они нужны для пропорций Original.
// Если файл повреждён, readImageSize выбросит ошибку, и её покажет тот, кто добавлял фото
const createPhoto = async (file: File): Promise<CreatePostPhoto> => {
    const { width, height } = await readImageSize(file);

    return {
        id: crypto.randomUUID(), // уникальный id, чтобы отличать фото друг от друга
        originalFile: file,
        width,
        height,
        croppedFile: null,
        cropSettings: INITIAL_CROP_SETTINGS,
        filter: null,
        filteredFile: null,
    };
};

// Сбрасывает обрезку у всех фото: нужно, когда у рамки меняется форма
const resetCropSettings = (photos: CreatePostPhoto[]): CreatePostPhoto[] =>
    photos.map(photo => ({ ...photo, cropSettings: INITIAL_CROP_SETTINGS }));

// Хранит общее состояние окна создания поста
export const useCreatePost = (): UseCreatePost => {
    const [state, setState] = useState<CreatePostState>(INITIAL_STATE);

    const goToStep = (step: CreatePostStep): void => {
        setState(prev => ({ ...prev, step }));
    };

    // Фото выбрано на шаге Add Photo: начинаем пост заново с этим фото и открываем обрезку.
    // На Add Photo можно вернуться стрелкой «Назад», а по ТЗ это закрытие публикации
    // (задача 8). Поэтому от прошлой публикации ничего не берём: ни фото, ни пропорции,
    // ни описание. Добавляет фото к посту галерея на шаге Cropping
    const selectPhoto = async (file: File): Promise<void> => {
        const photo = await createPhoto(file);

        setState({ ...INITIAL_STATE, photos: [photo], step: 'cropping' });
    };

    // Open Draft: берём фото, фильтры и описание из черновика и открываем шаг Cropping.
    // Обрезку черновик не хранит (задача 9), поэтому она начинается заново, с пропорций Original
    const openDraft = async (draft: PostDraft): Promise<void> => {
        const photos = await Promise.all(
            draft.photos.map(async (draftPhoto): Promise<CreatePostPhoto> => {
                const photo = await createPhoto(toFile(draftPhoto));

                // id и фильтр берём из черновика
                return { ...photo, id: draftPhoto.id, filter: draftPhoto.filter };
            }),
        );

        setState({
            step: 'cropping',
            photos,
            currentIndex: 0,
            aspect: 'original',
            description: draft.description,
        });
    };

    // Переключает фото на шаге Cropping: стрелками или миниатюрой в галерее
    const showPhoto = (index: number): void => {
        setState(prev => ({ ...prev, currentIndex: index }));
    };

    // Плюс в галерее: добавляем фото в конец и сразу показываем его.
    // Файл уже проверен. Плюс неактивен на 10-м фото, но проверяем лимит и здесь
    const addPhoto = async (file: File): Promise<void> => {
        const photo = await createPhoto(file);

        setState(prev => {
            if (prev.photos.length >= MAX_PHOTOS) return prev;

            return {
                ...prev,
                photos: [...prev.photos, photo],
                currentIndex: prev.photos.length, // номер нового фото: оно встало в конец
            };
        });
    };

    // Крестик в галерее: удаляем фото
    const removePhoto = (photoId: string): void => {
        setState(prev => {
            const removedIndex = prev.photos.findIndex(photo => photo.id === photoId);
            const photos = prev.photos.filter(photo => photo.id !== photoId);

            // Удалили последнее фото: показывать нечего, возвращаемся на Add Photo
            if (photos.length === 0) return INITIAL_STATE;

            // Если удалили фото левее текущего, все фото сдвинулись на одно влево.
            // Если удалили само текущее, показываем следующее, а если оно было последним, предыдущее
            const currentIndex =
                removedIndex < prev.currentIndex
                    ? prev.currentIndex - 1
                    : Math.min(prev.currentIndex, photos.length - 1);

            // Пропорции Original берутся у первого фото. Удалили первое: у рамки другая форма,
            // поэтому, как при смене пропорций, сбрасываем обрезку у всех фото
            const isFrameChanged = prev.aspect === 'original' && removedIndex === 0;

            return {
                ...prev,
                photos: isFrameChanged ? resetCropSettings(photos) : photos,
                currentIndex,
            };
        });
    };

    // Новые пропорции: у рамки другая форма, поэтому прежний сдвиг и выбранная область
    // больше не подходят. Сбрасываем их у всех фото, область выберется заново.
    // Повторный выбор тех же пропорций ничего не меняет, обрезка остаётся
    const setAspect = (aspect: CropAspect): void => {
        setState(prev =>
            prev.aspect === aspect
                ? prev
                : { ...prev, aspect, photos: resetCropSettings(prev.photos) },
        );
    };

    // Меняет обрезку одного фото: сдвиг, приближение или выбранную область
    const updateCropSettings = (
        photoId: string,
        changes: Partial<CropSettings>,
    ): void => {
        setState(prev => ({
            ...prev,
            photos: prev.photos.map(photo =>
                photo.id === photoId
                    ? { ...photo, cropSettings: { ...photo.cropSettings, ...changes } }
                    : photo,
            ),
        }));
    };

    // Кнопка Next на шаге Cropping: вырезаем выбранную область из каждого фото
    // и переходим к фильтрам. Если обрезка не удалась, ошибку покажет окно
    const cropAndContinue = async (): Promise<void> => {
        const aspectRatio = getAspectRatio(state.aspect, state.photos[0]);
        const croppedFiles = await cropPhotos(state.photos, aspectRatio);

        setState(prev => ({
            ...prev,
            photos: prev.photos.map((photo, index) => ({
                ...photo,
                croppedFile: croppedFiles[index],
            })),
            step: 'filters',
        }));
    };

    return {
        state,
        goToStep,
        selectPhoto,
        openDraft,
        showPhoto,
        addPhoto,
        removePhoto,
        setAspect,
        updateCropSettings,
        cropAndContinue,
    };
};
