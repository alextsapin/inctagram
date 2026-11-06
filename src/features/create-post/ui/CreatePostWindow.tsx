'use client';

import { Button } from '@/shared/ui/button';
import { ArrowLeftIcon } from '@/shared/ui/icons';
import { Modal } from '@/shared/ui/modal';

import { STEP_SETTINGS } from '../model/stepSettings';
import { useCreatePost } from '../model/useCreatePost';

import css from './create-post-window.module.scss';

type CreatePostWindowProps = {
    onClose: () => void;
};

export const CreatePostWindow = ({
    onClose,
}: CreatePostWindowProps): React.JSX.Element => {
    const { state, goToStep } = useCreatePost();
    const { title, width, back, next } = STEP_SETTINGS[state.step];

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
            {/* Заглушка: настоящие экраны делаются в задачах 4, 5, 6 и 7 */}
            <div className={css.stub}>
                <p>{title}</p>
                {!back && next && <Button onClick={() => goToStep(next)}>Next</Button>}
            </div>
        </Modal>
    );
};
