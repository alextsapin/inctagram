import { EditPostPage } from '@/pages/post-edit';

type Props = {
    params: Promise<{ postId: string }>;
};

const EditPage = async ({ params }: Props): Promise<React.JSX.Element> => {
    const { postId } = await params;

    return <EditPostPage postId={postId} />;
};

export default EditPage;
