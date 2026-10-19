'use client';

import { useState } from 'react';

import Image from 'next/image';

import eyeOffOutline from '../assets/eye-off-outline.svg';
import eyeOutline from '../assets/eye-outline.svg';

import css from './input.module.scss';

const ICON_SIZE = 24;

type InputProps = React.ComponentPropsWithRef<'input'> & {
    error?: boolean;
    showPasswordToggle?: boolean;
};

export const Input = ({
    className,
    ref,
    type = 'text',
    error = false,
    showPasswordToggle = false,
    disabled,
    'aria-invalid': ariaInvalid,
    ...props
}: InputProps): React.JSX.Element => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const canTogglePassword = Boolean(showPasswordToggle && type === 'password');
    const resolvedType = canTogglePassword && isPasswordVisible ? 'text' : type;

    const inputClass = [
        css.input,
        error && css.error,
        canTogglePassword && css['with-toggle'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const resolvedAriaInvalid = ariaInvalid ?? error;

    const handleTogglePassword = (): void => {
        setIsPasswordVisible(prev => !prev);
    };

    if (!canTogglePassword) {
        return (
            <input
                ref={ref}
                type={type}
                className={inputClass}
                disabled={disabled}
                aria-invalid={resolvedAriaInvalid || undefined}
                {...props}
            />
        );
    }

    return (
        <div className={css.wrapper}>
            <input
                ref={ref}
                type={resolvedType}
                className={inputClass}
                disabled={disabled}
                aria-invalid={resolvedAriaInvalid || undefined}
                {...props}
            />
            <button
                type="button"
                className={css.toggle}
                onClick={handleTogglePassword}
                disabled={disabled}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
                <Image
                    src={isPasswordVisible ? eyeOffOutline : eyeOutline}
                    alt=""
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                />
            </button>
        </div>
    );
};
