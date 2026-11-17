import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/entities/post';

import { editPost } from '../api/editPostApi';

type EditPostVariables = {
    postId: string;
    caption: string;
};

export const useEditPost = (): UseMutationResult<void, Error, EditPostVariables> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, caption }: EditPostVariables) => editPost(postId, caption),

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: postQueryKeys.detail(variables.postId),
            });
        },
    });
};
