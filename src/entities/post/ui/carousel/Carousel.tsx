'use client';

import { useState } from 'react';

import { IconButton } from '@/shared/ui/icon-button/';
import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui/icons';

import { PostImage } from '../../model/type';

import s from './carousel.module.scss';
import { CarouselSlide } from './CarouselSlide';

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
                <CarouselSlide key={slides[0].url} slide={slides[0]} />
            </div>
        );
    }

    return (
        <div className={s.container}>
            {/* key по ссылке: при переключении фото попытки загрузки считаются заново */}
            <CarouselSlide key={slides[index].url} slide={slides[index]} />

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
