import type { CreatePostPhoto, CropAspect } from './types';

// Пункты меню пропорций, в порядке из макета
export const ASPECT_OPTIONS: { value: CropAspect; label: string }[] = [
    { value: 'original', label: 'Original' },
    { value: '1:1', label: '1:1' },
    { value: '4:5', label: '4:5' },
    { value: '16:9', label: '16:9' },
];

// Стороны рамки для пунктов с заданными пропорциями: 4:5 — это 4 в ширину на 5 в высоту
const FIXED_SIDES: Record<
    Exclude<CropAspect, 'original'>,
    { width: number; height: number }
> = {
    '1:1': { width: 1, height: 1 },
    '4:5': { width: 4, height: 5 },
    '16:9': { width: 16, height: 9 },
};

// Пропорции числом: ширина, делённая на высоту. Так их принимает react-easy-crop:
// 1 — квадрат, 0.8 — вертикальная рамка, 1.78 — горизонтальная.
// У Original пропорции первого фото
export const getAspectRatio = (
    aspect: CropAspect,
    firstPhoto: CreatePostPhoto,
): number => {
    const sides = aspect === 'original' ? firstPhoto : FIXED_SIDES[aspect];

    return sides.width / sides.height;
};
