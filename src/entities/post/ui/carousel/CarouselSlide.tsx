'use client';

import Image from 'next/image';

import { useImageRetry } from '@/shared/hooks';
import { Spinner } from '@/shared/ui/spinner';

import { PostImage } from '../../model/type';

import s from './carousel.module.scss';

const SPINNER_SIZE = 40;

type Props = {
    slide: PostImage;
};

// Одно фото карусели. Пока фото не загрузилось, на тёмном фоне крутится спиннер,
// а не значок «сломанной» картинки. Сразу после публикации фото ещё нет в хранилище
// (ссылка отвечает 404), поэтому хук повторяет загрузку
export const CarouselSlide = ({ slide }: Props): React.JSX.Element => {
    const { attempt, isLoaded, isWaiting, isGivenUp, handleLoad, handleError } =
        useImageRetry();

    // Время вышло: спиннер убираем, остаётся тёмный фон
    const isLoading = !isLoaded && !isGivenUp;

    return (
        <div className={s.viewport}>
            {isLoading && (
                <div className={s.loader}>
                    <Spinner size={SPINNER_SIZE} />
                </div>
            )}

            {!isWaiting && !isGivenUp && (
                <Image
                    // Новый key после ошибки: React создаёт картинку заново,
                    // и браузер повторяет запрос
                    key={`${slide.url}-${attempt}`}
                    src={slide.url}
                    alt={slide.alt || ''}
                    fill
                    sizes="(max-width: 480px) 100vw, 480px"
                    priority
                    className={`${s.image} ${isLoaded ? s.loaded : ''}`}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    );
};
