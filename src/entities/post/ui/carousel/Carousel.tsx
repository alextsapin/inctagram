'use client';

import { useState } from 'react';

import Link from 'next/link';

import { IconButton } from '@/shared/ui/icon-button/';
import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui/icons';

import { PostImage } from '../../model/type';

import s from './carousel.module.scss';
import { CarouselSlide } from './CarouselSlide';

// Размер стрелок в пикселях. Обычные для окна поста, маленькие для карточки
// на главной: по макету там стрелки 24x24
const ARROW_SIZE = {
    medium: 40,
    small: 24,
};

type Props = {
    slides?: PostImage[];
    initialIndex?: number;
    // small: маленькие стрелки и точки для карточки на главной
    size?: 'medium' | 'small';
    slideHref?: string;
};

export const Carousel = ({
    slides = [],
    initialIndex = 0,
    size = 'medium',
    slideHref,
}: Props): React.JSX.Element => {
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
        const slide = <CarouselSlide key={slides[0].url} slide={slides[0]} />;

        return (
            <div className={s.container}>
                {slideHref ? (
                    <Link href={slideHref} className={s['slide-link']}>
                        {slide}
                    </Link>
                ) : (
                    slide
                )}
            </div>
        );
    }

    return (
        <div className={`${s.container} ${size === 'small' ? s.small : ''}`}>
            {/* key по ссылке: при переключении фото попытки загрузки считаются заново */}
            {slideHref ? (
                <Link href={slideHref} className={s['slide-link']}>
                    <CarouselSlide key={slides[index].url} slide={slides[index]} />
                </Link>
            ) : (
                <CarouselSlide key={slides[index].url} slide={slides[index]} />
            )}

            <IconButton
                size={ARROW_SIZE[size]}
                label="Prev slide"
                className={s['btn-prev']}
                onClick={() => goTo(index - 1)}
            >
                <ArrowLeftIcon />
            </IconButton>

            <IconButton
                size={ARROW_SIZE[size]}
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
