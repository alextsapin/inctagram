'use client';

import { useObjectUrl } from '@/shared/hooks';
import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui/icons';

import { getFilterStyle } from '../lib/filters';
import type { CreatePostPhoto } from '../model/types';

import css from './photo-preview.module.scss';

// В макете стрелки 48px, а иконки в проекте нарисованы на 24px
const ARROW_ICON_SIZE = 48;

type PhotoPreviewProps = {
    photos: CreatePostPhoto[]; // все фото поста
    currentIndex: number; // номер фото, которое сейчас на экране
    // Пока Next готовит файлы или Publish отправляет пост, стрелки неактивны
    disabled: boolean;
    // На Publication показываем готовый файл с фильтром: ровно то, что уйдёт на сервер.
    // На Filters фильтр ещё выбирают, поэтому там обрезанное фото с CSS-фильтром
    showFilteredFile?: boolean;
    onShowPhoto: (index: number) => void;
};

// Фото поста в левой части окна: уже обрезанное и с выбранным фильтром.
// Между фото переключают стрелки, точки показывают, какое фото на экране.
// В макете так выглядят шаги Filters и Publication, поэтому это отдельный компонент
export const PhotoPreview = ({
    photos,
    currentIndex,
    disabled,
    showFilteredFile = false,
    onShowPhoto,
}: PhotoPreviewProps): React.JSX.Element => {
    const photo = photos[currentIndex];
    const filteredFile = showFilteredFile ? photo.filteredFile : null;
    // После шага Cropping обрезанный файл есть у каждого фото, originalFile — на всякий случай
    const photoUrl = useObjectUrl(
        filteredFile ?? photo.croppedFile ?? photo.originalFile,
    );
    // В готовом файле фильтр уже нарисован, поэтому CSS-фильтр второй раз не накладываем
    const filterStyle = filteredFile ? 'none' : getFilterStyle(photo.filter);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === photos.length - 1;

    return (
        <div className={css.preview}>
            {/* Обычный <img>: next/image не работает с временными ссылками blob: */}
            {photoUrl && (
                <img
                    src={photoUrl}
                    alt=""
                    className={css.image}
                    style={{ filter: filterStyle }}
                />
            )}

            {/* Стрелки по кругу не ходят: на первом фото нет «назад», на последнем нет «вперёд» */}
            {!isFirst && (
                <button
                    type="button"
                    className={`${css.arrow} ${css.prev}`}
                    aria-label="Previous photo"
                    disabled={disabled}
                    onClick={() => onShowPhoto(currentIndex - 1)}
                >
                    <ArrowLeftIcon width={ARROW_ICON_SIZE} height={ARROW_ICON_SIZE} />
                </button>
            )}

            {!isLast && (
                <button
                    type="button"
                    className={`${css.arrow} ${css.next}`}
                    aria-label="Next photo"
                    disabled={disabled}
                    onClick={() => onShowPhoto(currentIndex + 1)}
                >
                    <ArrowRightIcon width={ARROW_ICON_SIZE} height={ARROW_ICON_SIZE} />
                </button>
            )}

            {/* Точки только показывают, какое фото на экране. Для одного фото они не нужны */}
            {photos.length > 1 && (
                <div className={css.dots} aria-hidden="true">
                    {photos.map((item, index) => (
                        <span
                            key={item.id}
                            className={
                                index === currentIndex
                                    ? `${css.dot} ${css.current}`
                                    : css.dot
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
