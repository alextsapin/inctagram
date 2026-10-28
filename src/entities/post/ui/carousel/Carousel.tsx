'use client';

import { useState } from 'react';

import Image from 'next/image';

import { IconButton } from '@/shared/ui/icon-button/';
import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui/icons';

import s from './carousel.module.scss';

export type PostImage = {
    id: string;
    url: string;
    alt?: string;
};
type Props = {
    slides?: PostImage[];
    initialIndex?: number;
};

export const Carousel = ({ slides = [], initialIndex = 0 }: Props): React.JSX.Element => {
    const [index, setIndex] = useState(initialIndex);
    const total = slides.length;

    const goTo = (next: number): void => {
        if (total === 0) return;
        const clamped = (next + total) % total;

        setIndex(clamped);
    };

    if (total === 0) {
        return (
            <div
                className={s['no-image']}
                role="img"
                aria-label="Изображения отсутствуют"
            >
                <span>Нет изображений</span>
            </div>
        );
    }

    if (total === 1) {
        return (
            <div className={s.container}>
                <div className={s.viewport}>
                    <Image
                        src={slides[0].url}
                        alt={slides[0].alt || ''}
                        fill
                        sizes="(max-width: 480px) 100vw, 480px"
                        priority
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <div className={s.viewport}>
                <Image
                    src={slides[index].url}
                    alt={slides[index].alt || ''}
                    fill
                    sizes="(max-width: 480px) 100vw, 480px"
                    priority
                />
            </div>

            <IconButton
                size={40}
                label="Prev slide"
                className={s['btn-prev']}
                onClick={() => goTo(index - 1)}
            >
                <ArrowLeftIcon />
            </IconButton>

            <IconButton
                size={40}
                label="Next slide"
                className={s['btn-next']}
                onClick={() => goTo(index + 1)}
            >
                <ArrowRightIcon />
            </IconButton>

            <div className={s.dots}>
                {slides.map((slide, i) => (
                    <button
                        key={slide.id}
                        type="button"
                        aria-label={`Go to the slide ${i + 1}`}
                        className={i === index ? s.active : undefined}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>
        </div>
    );
};
