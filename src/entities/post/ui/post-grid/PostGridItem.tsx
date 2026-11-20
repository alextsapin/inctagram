'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useImageRetry } from '@/shared/hooks';
import { Spinner } from '@/shared/ui/spinner';

import s from './post-grid.module.scss';

const SPINNER_SIZE = 24;

type Props = {
    postId: string;
    previewUrl?: string | null; // квадратное превью от бэкенда, его может ещё не быть
    photoUrl?: string; // первое фото поста: запасной вариант, если превью не открылось
};

// Плитка поста в сетке профиля. Пока картинка не загрузилась, плитка серая
// и на ней крутится спиннер, а не значок «сломанной» картинки
export const PostGridItem = ({
    postId,
    previewUrl,
    photoUrl,
}: Props): React.JSX.Element => {
    // true, если превью не открылось и показываем первое фото
    const [isPreviewBroken, setIsPreviewBroken] = useState(false);
    // Бэкенд загружает фото в хранилище в фоне: сразу после публикации ссылка
    // может ещё не работать. Хук повторяет загрузку после ошибки
    const { attempt, isLoaded, isWaiting, isGivenUp, handleLoad, handleError } =
        useImageRetry();

    // Сначала превью, а если его нет или оно не открылось, то первое фото
    const imageUrl = previewUrl && !isPreviewBroken ? previewUrl : photoUrl;

    const handleImageError = (): void => {
        // Превью не открылось: сразу пробуем первое фото, без паузы
        if (imageUrl === previewUrl && photoUrl && photoUrl !== previewUrl) {
            setIsPreviewBroken(true);

            return;
        }

        handleError();
    };

    // Время вышло или фото нет: спиннер убираем, остаётся тёмная плитка
    const isLoading = Boolean(imageUrl) && !isLoaded && !isGivenUp;

    return (
        <Link
            href={`/post/${postId}`}
            className={`${s.item} ${isLoading ? s.loading : ''}`}
        >
            {isLoading && (
                <div className={s.loader}>
                    <Spinner size={SPINNER_SIZE} />
                </div>
            )}

            {imageUrl && !isWaiting && !isGivenUp && (
                <Image
                    // Новый key при смене ссылки или после ошибки: React создаёт картинку
                    // заново, и браузер повторяет запрос. Параметр в адрес добавить нельзя:
                    // next.config разрешает ссылки на хранилище только без параметров
                    key={`${imageUrl}-${attempt}`}
                    src={imageUrl}
                    alt=""
                    fill
                    className={`${s.image} ${isLoaded ? s.loaded : ''}`}
                    // Ширина плитки: на телефоне половина экрана, иначе не больше 234px
                    sizes="(max-width: 768px) 50vw, 234px"
                    // Ленивая загрузка (задача 12: «В PostGrid поставить ленивую загрузку»).
                    // eager был временным решением, пока постов в профиле мало.
                    loading="lazy"
                    onLoad={handleLoad}
                    onError={handleImageError}
                />
            )}
        </Link>
    );
};
