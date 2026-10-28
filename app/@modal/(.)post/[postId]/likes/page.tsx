'use client';

import { use } from 'react';

import { PostLikesPage } from '@/pages/post-likes';

export const LikesModalPage = ({
    params,
}: {
    params: Promise<{ postId: string }>;
}): React.JSX.Element => {
    const { postId } = use(params);

    return <PostLikesPage postId={postId} isModal />;
};
export default LikesModalPage;
