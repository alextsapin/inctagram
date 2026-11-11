'use client';

import { useObjectUrl } from '@/shared/hooks';

import { FILTER_NAMES, getFilterLabel, getFilterStyle } from '../lib/filters';
import type { CreatePostPhoto } from '../model/types';

import css from './filters-step.module.scss';
import { PhotoPreview } from './PhotoPreview';

type FiltersStepProps = {
    photos: CreatePostPhoto[]; // все фото поста
    currentIndex: number; // номер фото, которое сейчас на экране
    // Пока Next рисует фильтры в файлы, плитки неактивны:
    // фильтр, выбранный в это время, в файл уже не попал бы
    disabled: boolean;
    onShowPhoto: (index: number) => void;
    onFilterChange: (photoId: string, filter: string | null) => void;
};

// Третий шаг окна создания поста: слева фото, справа плитки с этим же фото
// под разными фильтрами. Клик по плитке выбирает фильтр для фото на экране.
// У каждого фото свой фильтр, выбирать его необязательно
export const FiltersStep = ({
    photos,
    currentIndex,
    disabled,
    onShowPhoto,
    onFilterChange,
}: FiltersStepProps): React.JSX.Element => {
    const photo = photos[currentIndex];
    // Одна ссылка на фото для всех 40 плиток, а не по ссылке на каждую
    const photoUrl = useObjectUrl(photo.croppedFile ?? photo.originalFile);

    return (
        <div className={css.step}>
            <PhotoPreview
                photos={photos}
                currentIndex={currentIndex}
                onShowPhoto={onShowPhoto}
            />

            <ul className={css.filters}>
                {FILTER_NAMES.map(filter => (
                    <li key={filter ?? 'normal'}>
                        <button
                            type="button"
                            className={css.filter}
                            aria-pressed={photo.filter === filter}
                            disabled={disabled}
                            onClick={() => onFilterChange(photo.id, filter)}
                        >
                            {/* Обычный <img>: next/image не работает с временными ссылками blob: */}
                            {photoUrl && (
                                <img
                                    src={photoUrl}
                                    alt=""
                                    className={css.image}
                                    style={{ filter: getFilterStyle(filter) }}
                                />
                            )}
                            {getFilterLabel(filter)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
