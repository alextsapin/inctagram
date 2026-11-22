import { use } from 'react';

import { Post } from '@/pages/post';

type Props = {
    params: Promise<{ postId: string }>;
};

const PostModalPage = ({ params }: Props): React.JSX.Element => {
    const { postId } = use(params);

    return <Post postId={postId} isModal />;
};

export default PostModalPage;
