/* eslint-disable prettier/prettier */
import css from './button.module.scss';

type ButtonProps = React.ComponentProps<'button'>;

export const Button = ({children, className, ...props}: ButtonProps): React.JSX.Element => {
    return (
        <button type="button" className={`${css.button} ${className ?? ''}`} {...props}>
            {children}
        </button>
    );
};
