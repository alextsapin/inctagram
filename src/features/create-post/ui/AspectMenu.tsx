import { ImageIcon } from '@/shared/ui/icons';

import { ASPECT_OPTIONS } from '../model/aspect';
import type { CropAspect } from '../model/types';

import css from './aspect-menu.module.scss';

// Рамка-подсказка справа от пунктов 1:1, 4:5 и 16:9, как в макете
const SHAPE_CLASSES: Record<Exclude<CropAspect, 'original'>, string> = {
    '1:1': css.square,
    '4:5': css.portrait,
    '16:9': css.landscape,
};

type AspectMenuProps = {
    value: CropAspect;
    onChange: (aspect: CropAspect) => void;
};

// Меню пропорций на шаге Cropping: Original, 1:1, 4:5 и 16:9
export const AspectMenu = ({ value, onChange }: AspectMenuProps): React.JSX.Element => (
    <ul className={css.menu}>
        {ASPECT_OPTIONS.map(option => {
            const isActive = option.value === value;

            return (
                <li key={option.value}>
                    <button
                        type="button"
                        className={isActive ? `${css.option} ${css.active}` : css.option}
                        aria-pressed={isActive}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                        <span className={css.icon}>
                            {option.value === 'original' ? (
                                <ImageIcon />
                            ) : (
                                <span className={SHAPE_CLASSES[option.value]} />
                            )}
                        </span>
                    </button>
                </li>
            );
        })}
    </ul>
);
