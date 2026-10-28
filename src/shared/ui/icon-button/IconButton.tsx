import type { ButtonHTMLAttributes, ReactNode } from 'react';

import s from './icon-button.module.scss';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    children: ReactNode;
    size?: number;
    isActive?: boolean;
    text?: string;
};

export const IconButton = ({
    label,
    children,
    size,
    isActive,
    className,
    text,
    style: userStyle,
    ...rest
}: IconButtonProps): React.JSX.Element => {
    const classes = [s.btn, isActive && s.active, className].filter(Boolean).join(' ');

    const style = {
        '--icon-size': `${size}px`,
        ...userStyle,
    } as React.CSSProperties;

    return (
        <button
            type="button"
            aria-label={label}
            className={classes}
            style={style}
            {...rest}
        >
            {children}
            {text && <span className={s.text}>{text}</span>}
        </button>
    );
};
