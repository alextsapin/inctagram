'use client';

import { useId, useRef, useState, type ReactNode } from 'react';

import { useCloseOnOutsideClick } from '@/shared/hooks';

import css from './popover.module.scss';

export type PopoverProps = {
    trigger: ReactNode;
    triggerLabel?: string;
    triggerClassName?: string;
    align?: 'start' | 'end';
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
};

export const Popover = ({
    trigger,
    triggerLabel,
    triggerClassName,
    align = 'start',
    open,
    onOpenChange,
    children,
}: PopoverProps): React.JSX.Element => {
    const [internalOpen, setInternalOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentId = useId();

    const isOpen = open ?? internalOpen;

    const changeOpen = (nextOpen: boolean): void => {
        if (open === undefined) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    useCloseOnOutsideClick(wrapperRef, isOpen, () => {
        changeOpen(false);
    });

    const togglePopover = (): void => {
        changeOpen(!isOpen);
    };

    return (
        <div ref={wrapperRef} className={css.wrapper}>
            <button
                type="button"
                className={[css.trigger, triggerClassName].filter(Boolean).join(' ')}
                aria-label={triggerLabel}
                aria-expanded={isOpen}
                aria-controls={isOpen ? contentId : undefined}
                onClick={togglePopover}
            >
                {trigger}
            </button>

            {isOpen && (
                <div id={contentId} className={`${css.content} ${css[align]}`}>
                    {children}
                </div>
            )}
        </div>
    );
};
