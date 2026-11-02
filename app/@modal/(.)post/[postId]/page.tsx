import { use } from 'react';

import { PostPage } from '@/pages/post';

type Props = {
    params: Promise<{ postId: string }>;
};

const PostModalPage = ({ params }: Props): React.JSX.Element => {
    const { postId } = use(params);

    return <PostPage postId={postId} isModal />;
};

export default PostModalPage;
