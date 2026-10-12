'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import ru from '../assets/ru.png';
import uk from '../assets/uk.png';

import css from './language.module.scss';

const languages = [
    { code: 'en', label: 'English', flag: uk },
    { code: 'ru', label: 'Russian', flag: ru },
] as const;

export const Language = (): React.JSX.Element => {
    const [language, setLanguage] = useState<'en' | 'ru'>('en');
    const [isOpen, setIsOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
    
        const handleClickOutside = (event: MouseEvent): void => {
            if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
    
        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const selected = language === 'en' ? languages[0] : languages[1];

    return (
        <div ref={wrapperRef} className={css.wrapper}>
            <button
                className={css.language}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Image src={selected.flag} width={20} height={14} alt={selected.code} />
                <span>{selected.label}</span>
                <span className={css.arrow} />
            </button>

            {isOpen && (
                <div className={css.dropdown}>
                    {languages.map(item => (
                        <button
                            key={item.code}
                            className={css.option}
                            type="button"
                            onClick={() => {
                                setLanguage(item.code);
                                setIsOpen(false);
                            }}
                        >
                            <Image
                                src={item.flag}
                                width={20}
                                height={14}
                                alt={item.code}
                            />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
