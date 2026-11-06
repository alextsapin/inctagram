import { type TabOption } from './types';

// Какой таб выбрать после нажатия клавиши на табе с номером currentIndex.
// Возвращает номер нового таба или null, если клавиша к табам не относится
export const getNextTabIndex = (
    key: string,
    options: TabOption[],
    currentIndex: number,
): number | null => {
    // Номера табов, которые можно выбрать. Отключённые пропускаем
    const enabledIndexes: number[] = [];

    options.forEach((option, index) => {
        if (!option.disabled) enabledIndexes.push(index);
    });

    // Место текущего таба среди доступных: 0 — первый, lastPosition — последний.
    // Текущий таб всегда доступен: на отключённый таб фокус не попадает
    const position = enabledIndexes.indexOf(currentIndex);
    const lastPosition = enabledIndexes.length - 1;

    switch (key) {
        case 'ArrowRight':
            // С последнего таба переходим на первый, по кругу
            return position === lastPosition
                ? enabledIndexes[0]
                : enabledIndexes[position + 1];
        case 'ArrowLeft':
            // С первого таба переходим на последний
            return position === 0
                ? enabledIndexes[lastPosition]
                : enabledIndexes[position - 1];
        case 'Home':
            return enabledIndexes[0];
        case 'End':
            return enabledIndexes[lastPosition];
        default:
            return null;
    }
};
