'use client';

import { useState } from 'react';

import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { ArrowLeftIcon } from '@/shared/ui/icons';
import { Modal } from '@/shared/ui/modal';

import { getAspectRatio } from '../model/aspect';
import { STEP_SETTINGS } from '../model/stepSettings';
import { useCreatePost } from '../model/useCreatePost';
import { useSavedDraft } from '../model/useSavedDraft';

import { AddPhotoStep } from './AddPhotoStep';
import css from './create-post-window.module.scss';
import { CroppingStep } from './CroppingStep';

type CreatePostWindowProps = {
    userId: string; // черновик хранится отдельно для каждого пользователя
    onClose: () => void;
};

export const CreatePostWindow = ({
    userId,
    onClose,
}: CreatePostWindowProps): React.JSX.Element => {
    const {
        state,
        goToStep,
        selectPhoto,
        openDraft,
        setAspect,
        updateCropSettings,
        cropAndContinue,
    } = useCreatePost();
    const { title, width, back, next } = STEP_SETTINGS[state.step];
    const savedDraft = useSavedDraft(userId);

    const [isCropping, setIsCropping] = useState(false);
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

    // Фото, которое сейчас обрезаем. Пока фото одно; переключать их будет галерея
    const currentPhoto = state.photos[0];

    // Next на шаге Cropping сначала вырезает выбранную область из каждого фото.
    // Это занимает время, поэтому пока идёт обрезка, кнопка неактивна
    const handleCropNext = async (): Promise<void> => {
        setIsCropping(true);

        try {
            await cropAndContinue();
        } catch {
            setError('Failed to crop the photo. Please try again');
        } finally {
            setIsCropping(false);
        }
    };

    const handleNext = (): void => {
        if (state.step === 'cropping') {
            handleCropNext();
        } else if (next) {
            goToStep(next);
        }
    };

    // На первом шаге стрелки и Next в шапке нет: там крестик, как в макете
    const headerLeft = back && (
        <button
            type="button"
            className={css.back}
            aria-label="Back"
            onClick={() => goToStep(back)}
        >
            <ArrowLeftIcon />
        </button>
    );

    // На последнем шаге вместо Next кнопка Publish. Пока она просто закрывает окно,
    // отправку поста добавит задача 7
    const headerRight = next ? (
        <Button
            variant="text"
            className={css.next}
            disabled={isCropping}
            onClick={handleNext}
        >
            Next
        </Button>
    ) : (
        <Button variant="text" className={css.next} onClick={onClose}>
            Publish
        </Button>
    );

    return (
        <Modal
            open
            onClose={onClose}
            title={title}
            width={width}
            headerLeft={headerLeft}
            headerRight={back && headerRight}
            // На шаге Cropping фото прилегает к краям окна, как в макете
            noPadding={state.step === 'cropping'}
        >
            {state.step === 'add-photo' && (
                <AddPhotoStep onSelect={selectPhoto} onOpenDraft={handleOpenDraft} />
            )}

            {state.step === 'cropping' && currentPhoto && (
                <CroppingStep
                    photo={currentPhoto}
                    aspect={state.aspect}
                    aspectRatio={getAspectRatio(state.aspect, state.photos[0])}
                    onAspectChange={setAspect}
                    onCropSettingsChange={changes =>
                        updateCropSettings(currentPhoto.id, changes)
                    }
                />
            )}

            {/* Заглушка: остальные экраны делаются в задачах 6 и 7 */}
            {(state.step === 'filters' || state.step === 'publication') && (
                <div className={css.stub}>
                    <p>{title}</p>
                </div>
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
