'use client';

import { Button } from '@/shared/ui/button';
import { ArrowLeftIcon } from '@/shared/ui/icons';
import { Modal } from '@/shared/ui/modal';

import { STEP_SETTINGS } from '../model/stepSettings';
import { useCreatePost } from '../model/useCreatePost';
import { useSavedDraft } from '../model/useSavedDraft';

import { AddPhotoStep } from './AddPhotoStep';
import css from './create-post-window.module.scss';

type CreatePostWindowProps = {
    userId: string; // черновик хранится отдельно для каждого пользователя
    onClose: () => void;
};

export const CreatePostWindow = ({
    userId,
    onClose,
}: CreatePostWindowProps): React.JSX.Element => {
    const { state, goToStep, selectPhoto, openDraft } = useCreatePost();
    const { title, width, back, next } = STEP_SETTINGS[state.step];
    const savedDraft = useSavedDraft(userId);

    // Кнопка Open Draft нужна, только если в черновике есть фото
    const handleOpenDraft =
        savedDraft && savedDraft.photos.length > 0
            ? () => openDraft(savedDraft)
            : undefined;

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
        <Button variant="text" className={css.next} onClick={() => goToStep(next)}>
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
        >
            {state.step === 'add-photo' ? (
                <AddPhotoStep onSelect={selectPhoto} onOpenDraft={handleOpenDraft} />
            ) : (
                // Заглушка: остальные экраны делаются в задачах 5, 6 и 7
                <div className={css.stub}>
                    <p>{title}</p>
                </div>
            )}
        </Modal>
    );
};
