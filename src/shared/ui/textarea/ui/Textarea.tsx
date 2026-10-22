import css from './textarea.module.scss';

type TextareaProps = React.ComponentPropsWithRef<'textarea'> & {
    error?: boolean;
};

export const Textarea = ({
    className,
    ref,
    error = false,
    ...props
}: TextareaProps): React.JSX.Element => {
    const textareaClass = [css.textarea, error && css.error, className]
        .filter(Boolean)
        .join(' ');

    return (
        <textarea
            ref={ref}
            className={textareaClass}
            aria-invalid={error || undefined}
            {...props}
        />
    );
};
