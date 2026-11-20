import s from './spinner.module.scss';

const DEFAULT_SIZE = 20;

type SpinnerProps = {
    size?: number; // ширина и высота кольца в пикселях
};

// Крутящееся кольцо: показывает, что что-то загружается.
// Скринридеру не нужно: подпись о загрузке, если она нужна, даёт родитель
export const Spinner = ({ size = DEFAULT_SIZE }: SpinnerProps): React.JSX.Element => {
    return (
        <span
            className={s.spinner}
            style={{ width: size, height: size }}
            aria-hidden="true"
        />
    );
};
