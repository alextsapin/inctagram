import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { confirmEmail } from '../api/confirmEmail';

export const useConfirmEmail = (): UseMutationResult<void, Error, string> => {
    return useMutation({
        mutationFn: confirmEmail,
    });
};
