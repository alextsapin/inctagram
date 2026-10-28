import { PostPage } from '@/pages/post';

type Props = {
    params: Promise<{ postId: string }>;
};

const PostModalPage = async ({ params }: Props): Promise<React.JSX.Element> => {
    const { postId } = await params;

    return <PostPage postId={postId} />;
};

export default PostModalPage;
