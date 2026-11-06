const DAY_DIGITS = 2; // dd
const DAY_AND_MONTH_DIGITS = 4; // ddmm
const ALL_DIGITS = 8; // ddmmyyyy

// Маска даты: оставляет только цифры и сама ставит слэши.
// «1212» → «12/12», «12121989» → «12/12/1989». Пользователь печатает только цифры
export const maskDate = (text: string): string => {
    const digits = text.replace(/\D/g, '').slice(0, ALL_DIGITS);

    const day = digits.slice(0, DAY_DIGITS);
    const month = digits.slice(DAY_DIGITS, DAY_AND_MONTH_DIGITS);
    const year = digits.slice(DAY_AND_MONTH_DIGITS);

    // Слэш ставим, только когда после него уже есть цифры:
    // иначе Backspace упирался бы в слэш, который маска тут же возвращает
    return [day, month, year].filter(Boolean).join('/');
};
