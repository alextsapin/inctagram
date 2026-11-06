// Нужна ли нажатая клавиша для поиска по буквам.
// isTyping — пользователь уже начал набирать слово
export const isSearchKey = (event: React.KeyboardEvent, isTyping: boolean): boolean => {
    // Сочетания вроде Ctrl+C не перехватываем
    if (event.ctrlKey || event.metaKey || event.altKey) {
        return false;
    }

    // У служебных клавиш длинное имя: 'Enter', 'ArrowDown', 'Escape'.
    // У букв и цифр — один символ: 'k', '7'
    if (event.key.length !== 1) {
        return false;
    }

    // Пробел — часть слова, только если набор уже начат («united k»).
    // Иначе пробел открывает список и выбирает пункт
    if (event.key === ' ') {
        return isTyping;
    }

    return true;
};
