'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/shared/ui/modal';
import { PostViewer } from '@/widgets/post-viewer';

type Props = {
    postId: string;
    isModal?: boolean;
};

export const PostPage = ({ postId, isModal }: Props): React.JSX.Element => {
    const router = useRouter();

    return isModal ? (
        <Modal open onClose={() => router.back()} width={972} closeOutside>
            <PostViewer postId={postId} />
        </Modal>
    ) : (
        <main
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '0 5px',
            }}
        >
            <PostViewer postId={postId} />
        </main>
    );
};
