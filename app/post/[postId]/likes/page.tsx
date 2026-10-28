import { PostLikesPage } from '@/pages/post-likes';

type Props = {
    params: Promise<{ postId: string }>;
};

const LikesPage = async ({ params }: Props): Promise<React.JSX.Element> => {
    const { postId } = await params;

    return <PostLikesPage postId={postId} />;
};

export default LikesPage;
