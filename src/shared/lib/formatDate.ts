import { format } from 'date-fns';

export const formatAbsoluteDate = (isoString: string): string => {
    return format(new Date(isoString), 'MMMM d, yyyy');
};
