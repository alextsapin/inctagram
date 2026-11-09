import { useState } from 'react';

import { cropPhotos } from '../lib/cropPhotos';
import { readImageSize } from '../lib/readImageSize';

import { getAspectRatio } from './aspect';
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

// Хранит общее состояние окна создания поста
export const useCreatePost = (): UseCreatePost => {
    const [state, setState] = useState<CreatePostState>(INITIAL_STATE);

    const goToStep = (step: CreatePostStep): void => {
        setState(prev => ({ ...prev, step }));
    };

    // Фото выбрано на шаге Add Photo: начинаем пост заново с этим фото и открываем обрезку.
    // Заменяем список целиком, а не добавляем: на Add Photo можно вернуться стрелкой «Назад»,
    // и тогда старое фото не должно остаться в посте. Добавлять фото будет галерея на шаге Cropping.
    // Размеры фото узнаём сразу: они нужны для пропорций Original.
    // Если файл повреждён, readImageSize выбросит ошибку, и шаг Add Photo её покажет
    const selectPhoto = async (file: File): Promise<void> => {
        const { width, height } = await readImageSize(file);

        const photo: CreatePostPhoto = {
            id: crypto.randomUUID(), // уникальный id, чтобы отличать фото друг от друга
            originalFile: file,
            width,
            height,
            croppedFile: null,
            cropSettings: INITIAL_CROP_SETTINGS,
            filter: null,
            filteredFile: null,
        };

        setState(prev => ({ ...prev, photos: [photo], step: 'cropping' }));
    };

    // Open Draft: берём фото, фильтры и описание из черновика и открываем шаг Cropping.
    // Обрезку черновик не хранит (задача 9), поэтому она начинается заново, с пропорций Original.
    // Размеры каждого фото узнаём так же, как при выборе с компьютера
    const openDraft = async (draft: PostDraft): Promise<void> => {
        const photos = await Promise.all(
            draft.photos.map(async (draftPhoto): Promise<CreatePostPhoto> => {
                const file = toFile(draftPhoto);
                const { width, height } = await readImageSize(file);

                return {
                    id: draftPhoto.id,
                    originalFile: file,
                    width,
                    height,
                    croppedFile: null,
                    cropSettings: INITIAL_CROP_SETTINGS,
                    filter: draftPhoto.filter,
                    filteredFile: null,
                };
            }),
        );

        setState({
            step: 'cropping',
            photos,
            aspect: 'original',
            description: draft.description,
        });
    };

    // Новые пропорции: у рамки другая форма, поэтому прежний сдвиг и выбранная область
    // больше не подходят. Сбрасываем их у всех фото, область выберется заново
    const setAspect = (aspect: CropAspect): void => {
        setState(prev => ({
            ...prev,
            aspect,
            photos: prev.photos.map(photo => ({
                ...photo,
                cropSettings: INITIAL_CROP_SETTINGS,
            })),
        }));
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
        setAspect,
        updateCropSettings,
        cropAndContinue,
    };
};
