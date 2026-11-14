import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getPost } from '../api/postApi';
import { postQueryKeys } from '../api/queryKeys';

import { Post } from './type';

// 3. Хук для получения одного поста по ID
export const usePost = (postId: string): UseQueryResult<Post, Error> => {
    return useQuery({
        queryKey: postQueryKeys.detail(postId),
        queryFn: () => getPost(postId),
        enabled: Boolean(postId),
    });
};
