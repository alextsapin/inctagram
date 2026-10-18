import css from './checkbox.module.scss';

type CheckboxProps = Omit<React.ComponentPropsWithRef<'input'>, 'type'>;

export const Checkbox = ({
    className,
    ref,
    ...props
}: CheckboxProps): React.JSX.Element => {
    const checkboxClass = [css.checkbox, className].filter(Boolean).join(' ');

    return <input ref={ref} type="checkbox" className={checkboxClass} {...props} />;
};
