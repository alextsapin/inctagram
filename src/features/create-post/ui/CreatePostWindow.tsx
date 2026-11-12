'use client';

import { useState } from 'react';

import { validatePhoto } from '@/shared/lib';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Confirmation } from '@/shared/ui/confirmation';
import { ArrowLeftIcon } from '@/shared/ui/icons';
import { Modal } from '@/shared/ui/modal';

import { createDraft } from '../lib/createDraft';
import { deleteDraft, saveDraft } from '../lib/draft';
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
    // Пост опубликован, черновик сохранён или удалён: окно закрывается
    // и ведёт в профиль. Как перейти в профиль, решает страница
    onGoToProfile: () => void;
};

export const CreatePostWindow = ({
    userId,
    username,
    onClose,
    onGoToProfile,
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

    // Next на шагах Cropping и Filters готовит файлы, Publish отправляет пост,
    // Save draft и Discard сохраняют или удаляют черновик.
    // Это занимает время, поэтому пока идёт работа, кнопки неактивны
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Вопрос «Close» перед выходом: удалить всё или сохранить черновик
    const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

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
            onGoToProfile();
        } catch {
            setError('Failed to publish the post. Please try again');
            setIsProcessing(false);
        }
    };

    // Клик мимо окна, Esc или крестик. Пока Next готовит файлы или Publish отправляет пост,
    // окно не закрывается: иначе работа продолжится в уже закрытом окне.
    // Фото ещё не выбраны: терять нечего, просто закрываем. Иначе сначала спрашиваем
    const handleClose = (): void => {
        if (isProcessing) return;

        if (state.photos.length === 0) {
            onClose();

            return;
        }

        setIsCloseDialogOpen(true);
    };

    // «Назад» на Cropping ведёт на Add Photo, а это выход из создания поста:
    // выбранные фото пропадут. Поэтому, как и при закрытии, сначала спрашиваем
    const handleBack = (): void => {
        if (state.step === 'cropping') {
            setIsCloseDialogOpen(true);
        } else if (back) {
            goToStep(back);
        }
    };

    // Save draft: сохраняем фото, фильтры и описание в черновик и уходим в профиль.
    // Если не получилось, закрываем вопрос и показываем ошибку, окно создания остаётся
    const handleSaveDraft = async (): Promise<void> => {
        setIsProcessing(true);

        try {
            await saveDraft(userId, createDraft(state.photos, state.description));
            // После успеха кнопки не включаем: окно закроется переходом в профиль
            onGoToProfile();
        } catch {
            setIsCloseDialogOpen(false);
            setError('Failed to save the draft. Please try again');
            setIsProcessing(false);
        }
    };

    // Discard: удаляем черновик и уходим в профиль. Выбранные фото пропадут
    // вместе с окном. Если черновик не удалился, остаёмся: иначе он тихо останется
    const handleDiscard = async (): Promise<void> => {
        setIsProcessing(true);

        try {
            await deleteDraft(userId);
            onGoToProfile();
        } catch {
            setIsCloseDialogOpen(false);
            setError('Failed to delete the draft. Please try again');
            setIsProcessing(false);
        }
    };

    // Крестик и Esc у вопроса закрывают только вопрос, пользователь остаётся в окне создания.
    // Пока черновик сохраняется или удаляется, вопрос не закрывается
    const handleCloseDialog = (): void => {
        if (!isProcessing) setIsCloseDialogOpen(false);
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
            onClick={handleBack}
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
        <>
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

            {/* Вопрос рядом с окном создания, а не внутри него: иначе Esc из вопроса
                дошёл бы и до окна создания и открыл бы вопрос заново.
                В Confirmation левая кнопка с рамкой называется confirm, а правая синяя cancel.
                По макету слева Discard, справа Save draft, поэтому Save draft передаём как cancel */}
            <Confirmation
                open={isCloseDialogOpen}
                title="Close"
                text={
                    <>
                        Do you really want to close the creation of a publication?
                        <br />
                        If you close everything will be deleted
                    </>
                }
                confirmText="Discard"
                cancelText="Save draft"
                actionsAlign="between"
                // Пока черновик сохраняется или удаляется, кнопки неактивны
                disabled={isProcessing}
                onConfirm={handleDiscard}
                onCancel={handleSaveDraft}
                onClose={handleCloseDialog}
            />
        </>
    );
};
