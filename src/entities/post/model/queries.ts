import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getPost } from '../api/postApi';
import { postQueryKeys } from '../api/queryKeys';

import { getMockFeedPosts } from './mock';
import { type Post } from './type';

// 3. Хук для получения одного поста по ID
export const usePost = (postId: string): UseQueryResult<Post, Error> => {
    return useQuery({
        queryKey: postQueryKeys.detail(postId),
        queryFn: () => getPost(postId),
        enabled: Boolean(postId),
    });
};
export const usePostFeed = (): UseQueryResult<Post[], Error> => {
    return useQuery({
        queryKey: postQueryKeys.feed(),
        queryFn: () => getMockFeedPosts(),
    });
};
