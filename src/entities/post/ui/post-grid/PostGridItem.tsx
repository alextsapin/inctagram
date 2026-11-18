'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import s from './post-grid.module.scss';

// Бэкенд загружает фото в хранилище в фоне: сразу после публикации ссылка
// может ещё не работать. Поэтому при ошибке пробуем загрузить картинку ещё раз
const MAX_RETRIES = 5;
// Пауза между попытками
const RETRY_DELAY_MS = 3000;

type Props = {
    postId: string;
    previewUrl?: string | null; // квадратное превью от бэкенда, его может ещё не быть
    photoUrl?: string; // первое фото поста: запасной вариант, если превью не открылось
};

// Плитка поста в сетке профиля. Пока картинка не загрузилась, на её месте
// пульсирует скелетон, а не значок «сломанной» картинки
export const PostGridItem = ({
    postId,
    previewUrl,
    photoUrl,
}: Props): React.JSX.Element => {
    const [isLoaded, setIsLoaded] = useState(false);
    // true, если превью не открылось и показываем первое фото
    const [isPreviewBroken, setIsPreviewBroken] = useState(false);
    // Номер попытки. Меняется после ошибки: картинка создаётся заново и грузится ещё раз
    const [attempt, setAttempt] = useState(0);
    const [hasFailed, setHasFailed] = useState(false);

    // Сначала превью, а если его нет или оно не открылось, то первое фото
    const imageUrl = previewUrl && !isPreviewBroken ? previewUrl : photoUrl;

    useEffect(() => {
        if (!hasFailed || attempt >= MAX_RETRIES) return;

        const timer = setTimeout(() => {
            setHasFailed(false);
            setAttempt(prev => prev + 1);
        }, RETRY_DELAY_MS);

        // Если плитка исчезла раньше, чем прошла пауза, повтор не нужен
        return (): void => clearTimeout(timer);
    }, [hasFailed, attempt]);

    const handleError = (): void => {
        // Превью не открылось: сразу пробуем первое фото, без паузы
        if (imageUrl === previewUrl && photoUrl && photoUrl !== previewUrl) {
            setIsPreviewBroken(true);

            return;
        }

        setHasFailed(true);
    };

    // Все попытки кончились или фото нет: не пульсируем, остаётся тёмная плитка
    const isGivenUp = hasFailed && attempt >= MAX_RETRIES;
    const isLoading = Boolean(imageUrl) && !isLoaded && !isGivenUp;

    return (
        <Link
            href={`/post/${postId}`}
            className={`${s.item} ${isLoading ? s.skeleton : ''}`}
        >
            {imageUrl && !hasFailed && (
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
                    onLoad={() => setIsLoaded(true)}
                    onError={handleError}
                />
            )}
        </Link>
    );
};
