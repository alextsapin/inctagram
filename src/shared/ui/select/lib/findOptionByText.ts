import { type SelectOption } from './types';

// Ищет пункт, название которого начинается с text.
// Как в нативном select: сначала ищем после текущего пункта, а не нашли — с начала списка.
// Ничего не нашлось — вернёт undefined
export const findOptionByText = (
    options: SelectOption[],
    text: string,
    startIndex: number,
): SelectOption | undefined => {
    const startsWithText = (option: SelectOption): boolean =>
        option.label.toLowerCase().startsWith(text.toLowerCase());

    // Сначала ищем от startIndex до конца списка
    const optionAfterStart = options.slice(startIndex).find(startsWithText);

    if (optionAfterStart) {
        return optionAfterStart;
    }

    // Не нашли — ищем с начала списка
    return options.find(startsWithText);
};
