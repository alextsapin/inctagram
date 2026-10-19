import css from './button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';

type ButtonProps = React.ComponentProps<'button'> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
};

export const Button = ({
    children,
    className,
    fullWidth = false,
    variant = 'primary',
    type = 'button',
    ...props
}: ButtonProps): React.JSX.Element => {
    const buttonClass = [
        css.button,
        css[variant],
        fullWidth && css['full-width'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button type={type} className={buttonClass} {...props}>
            {children}
        </button>
    );
};
