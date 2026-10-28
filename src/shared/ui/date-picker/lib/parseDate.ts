const FULL_DATE_LENGTH = 'dd/mm/yyyy'.length;

// Превращает текст «12/12/1989» в дату.
// Возвращает undefined, если дата введена не до конца или такого дня нет (31/02/1989)
export const parseDate = (text: string): Date | undefined => {
    if (text.length !== FULL_DATE_LENGTH) return undefined;

    const [day, month, year] = text.split('/').map(Number);

    // Месяцы в Date считаются с нуля: январь — 0
    const date = new Date(year, month - 1, day);

    // new Date не ругается на несуществующие даты, а переносит их: 31/02 станет 3 марта.
    // Поэтому сверяем, что получился тот же день, месяц и год, что ввёл пользователь
    const isRealDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    return isRealDate ? date : undefined;
};
