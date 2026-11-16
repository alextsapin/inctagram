import css from './zoom-slider.module.scss';

// Приближение от 1 (без приближения) до 3 раз, как умеет react-easy-crop
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const PERCENT = 100;

type ZoomSliderProps = {
    value: number;
    onChange: (zoom: number) => void;
};

// Ползунок приближения на шаге Cropping. В макете он есть только здесь,
// поэтому это обычный <input type="range"> со своими стилями, а не общий компонент
export const ZoomSlider = ({ value, onChange }: ZoomSliderProps): React.JSX.Element => {
    // Какая часть дорожки слева от кружка закрашена синим, в процентах
    const filledPercent = ((value - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * PERCENT;

    return (
        <div className={css.slider}>
            <input
                type="range"
                className={css.range}
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={value}
                aria-label="Zoom"
                // Ширина синей части меняется вместе с ползунком, поэтому задаём её здесь
                style={{ backgroundSize: `${filledPercent}% 100%` }}
                onChange={event => onChange(Number(event.target.value))}
            />
        </div>
    );
};
