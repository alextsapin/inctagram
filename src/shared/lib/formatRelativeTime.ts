import { formatDistanceToNow } from 'date-fns';
// Что делает: Вычисляет разницу между текущим моментом и датой создания.
// Возвращает текст вроде "5 minutes ago", "about 1 hour ago", "2 days ago".
// Пример:
// Вход: "2024-05-20T12:00:00Z"
// Сейчас: 14:30
// Выход: "about 2 hours ago"

export const formatRelativeTime = (isoString: string): string => {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true });
};
