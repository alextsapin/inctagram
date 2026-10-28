import { formatDistanceToNow } from 'date-fns';

export const formatRelativeTime = (isoString: string): string => {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true });
};
