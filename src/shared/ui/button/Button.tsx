import { ButtonHTMLAttributes, ReactNode } from 'react';

import css from './button.module.scss';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    children: ReactNode;
    type?: 'button' | 'submit';
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
}

export const Button = ({
    children,
    type = 'button',
    fullWidth,
    variant = 'primary',
    className,
    ...props
}: ButtonProps): React.JSX.Element => {
    const buttonClass = `${css.button} ${css[variant]} ${
        fullWidth ? css['full-width'] : ''
    } ${className || ''}`.trim();

    return (
        <button
            type={type === 'submit' ? 'submit' : 'button'}
            className={buttonClass}
            {...props}
        >
            {children}
        </button>
    );
};
