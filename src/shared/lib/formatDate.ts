import { format } from 'date-fns';
// Форматирует дату в фиксированный, красивый вид.
// Вход: "2021-07-03T12:00:00Z"
// Выход: "July 3, 2021"
export const formatAbsoluteDate = (isoString: string): string => {
    return format(new Date(isoString), 'MMMM d, yyyy');
};
