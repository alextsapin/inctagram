'use client';

import { use } from 'react';

import { EditPostPage } from '@/pages/post-edit';

export const EditModalPage = ({
    params,
}: {
    params: Promise<{ postId: string }>;
}): React.JSX.Element => {
    const { postId } = use(params);

    return <EditPostPage postId={postId} isModal />;
};
export default EditModalPage;
