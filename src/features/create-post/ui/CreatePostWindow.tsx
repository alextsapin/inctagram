'use client';

import { useState } from 'react';

import { validatePhoto } from '@/shared/lib';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { ArrowLeftIcon } from '@/shared/ui/icons';
import { Modal } from '@/shared/ui/modal';

import { getAspectRatio } from '../model/aspect';
import { POST_PHOTO_ERROR, POST_PHOTO_RULES } from '../model/photoRules';
import { STEP_SETTINGS } from '../model/stepSettings';
import { useCreatePost } from '../model/useCreatePost';
import { usePublishPost } from '../model/usePublishPost';
import { useSavedDraft } from '../model/useSavedDraft';

import { AddPhotoStep } from './AddPhotoStep';
import css from './create-post-window.module.scss';
import { CroppingStep } from './CroppingStep';
import { FiltersStep } from './FiltersStep';
import { PublicationStep } from './PublicationStep';

type CreatePostWindowProps = {
    userId: string; // черновик хранится отдельно для каждого пользователя
    username: string; // имя автора на шаге Publication
    onClose: () => void;
    onPublished: () => void; // пост опубликован: куда перейти, решает страница
};

export const CreatePostWindow = ({
    userId,
    username,
    onClose,
    onPublished,
}: CreatePostWindowProps): React.JSX.Element => {
    const {
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
        setFilter,
        applyFiltersAndContinue,
        setDescription,
    } = useCreatePost();
    const { mutateAsync: publishPost } = usePublishPost(userId, username);
    const { title, width, back, next } = STEP_SETTINGS[state.step];
    const savedDraft = useSavedDraft(userId);

    // Next на шагах Cropping и Filters готовит файлы, а Publish отправляет пост.
    // Это занимает время, поэтому пока идёт работа, кнопки неактивны
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Кнопка Open Draft нужна, только если в черновике есть фото.
    // Если фото из черновика не открылось, показываем ошибку и остаёмся на Add Photo
    const handleOpenDraft =
        savedDraft && savedDraft.photos.length > 0
            ? () => {
                  openDraft(savedDraft).catch(() => {
                      setError('Failed to open the draft. Please try again');
                  });
              }
            : undefined;

    // Плюс в галерее: проверяем файл по тем же правилам, что на шаге Add Photo.
    // Ошибку показываем всплывающим сообщением, а на экране остаётся прежнее фото
    const handleAddPhoto = (file: File): void => {
        const validationError = validatePhoto(file, POST_PHOTO_RULES);

        if (validationError) {
            setError(validationError);

            return;
        }

        // Формат подходит, но файл может оказаться повреждённым и не открыться
        addPhoto(file).catch(() => setError(POST_PHOTO_ERROR));
    };

    // Next на шаге Cropping сначала вырезает выбранную область из каждого фото
    const handleCropNext = async (): Promise<void> => {
        setIsProcessing(true);

        try {
            await cropAndContinue();
        } catch {
            setError('Failed to crop the photo. Please try again');
        } finally {
            setIsProcessing(false);
        }
    };

    // Next на шаге Filters рисует выбранные фильтры в файлы фото
    const handleFiltersNext = async (): Promise<void> => {
        setIsProcessing(true);

        try {
            await applyFiltersAndContinue();
        } catch {
            setError('Failed to apply the filter. Please try again');
        } finally {
            setIsProcessing(false);
        }
    };

    // Publish отправляет фото с фильтрами и описание. Если не получилось,
    // окно остаётся открытым, фото и текст не пропадают
    const handlePublish = async (): Promise<void> => {
        setIsProcessing(true);

        try {
            await publishPost({ photos: state.photos, description: state.description });
            // После успеха кнопки не включаем: окно закроется переходом в профиль,
            // а до этого второй клик по Publish создал бы второй такой же пост
            onPublished();
        } catch {
            setError('Failed to publish the post. Please try again');
            setIsProcessing(false);
        }
    };

    // Пока Next готовит файлы или Publish отправляет пост, окно не закрывается
    // ни по Esc, ни кликом мимо: иначе работа продолжится в уже закрытом окне
    const handleClose = (): void => {
        if (!isProcessing) onClose();
    };

    const handleNext = (): void => {
        if (state.step === 'cropping') {
            handleCropNext();
        } else if (state.step === 'filters') {
            handleFiltersNext();
        } else if (next) {
            goToStep(next);
        }
    };

    // На первом шаге стрелки и Next в шапке нет: там крестик, как в макете.
    // Пока Next готовит файлы или Publish отправляет пост, «Назад» неактивна:
    // иначе после этого окно само перебросило бы пользователя вперёд или в профиль
    const headerLeft = back && (
        <button
            type="button"
            className={css.back}
            aria-label="Back"
            disabled={isProcessing}
            onClick={() => goToStep(back)}
        >
            <ArrowLeftIcon />
        </button>
    );

    // На последнем шаге вместо Next кнопка Publish
    const headerRight = next ? (
        <Button
            variant="text"
            className={css.next}
            disabled={isProcessing}
            onClick={handleNext}
        >
            Next
        </Button>
    ) : (
        <Button
            variant="text"
            className={css.next}
            disabled={isProcessing}
            onClick={handlePublish}
        >
            Publish
        </Button>
    );

    return (
        <Modal
            open
            onClose={handleClose}
            title={title}
            width={width}
            headerLeft={headerLeft}
            headerRight={back && headerRight}
            // На всех шагах, кроме Add Photo, фото прилегает к краям окна, как в макете
            noPadding={state.step !== 'add-photo'}
        >
            {state.step === 'add-photo' && (
                <AddPhotoStep onSelect={selectPhoto} onOpenDraft={handleOpenDraft} />
            )}

            {state.step === 'cropping' && state.photos.length > 0 && (
                <CroppingStep
                    photos={state.photos}
                    currentIndex={state.currentIndex}
                    aspect={state.aspect}
                    // У Original пропорции первого фото, они общие для всех фото поста
                    aspectRatio={getAspectRatio(state.aspect, state.photos[0])}
                    onAspectChange={setAspect}
                    onCropSettingsChange={updateCropSettings}
                    onShowPhoto={showPhoto}
                    onAddPhoto={handleAddPhoto}
                    onRemovePhoto={removePhoto}
                />
            )}

            {state.step === 'filters' && state.photos.length > 0 && (
                <FiltersStep
                    photos={state.photos}
                    currentIndex={state.currentIndex}
                    disabled={isProcessing}
                    onShowPhoto={showPhoto}
                    onFilterChange={setFilter}
                />
            )}

            {state.step === 'publication' && state.photos.length > 0 && (
                <PublicationStep
                    photos={state.photos}
                    currentIndex={state.currentIndex}
                    username={username}
                    description={state.description}
                    disabled={isProcessing}
                    onShowPhoto={showPhoto}
                    onDescriptionChange={setDescription}
                />
            )}

            {/* Alert внутри Modal: рядом с ним он оказался бы под затемнением */}
            <Alert
                open={error !== null}
                onClose={() => setError(null)}
                message={error ?? ''}
            />
        </Modal>
    );
};
