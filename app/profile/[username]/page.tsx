import type { Metadata } from 'next';

import { UserProfile } from '@/pages/user-profile';

type ProfilePageProps = {
    params: Promise<{ username: string }>;
};

export const generateMetadata = async ({
    params,
}: ProfilePageProps): Promise<Metadata> => {
    const { username } = await params;

    return {
        title: `${username} | Inctagram`,
        description: `Profile of ${username} on Inctagram`,
    };
};

const ProfilePage = async ({ params }: ProfilePageProps): Promise<React.JSX.Element> => {
    const { username } = await params;

    return <UserProfile username={username} />;
};

export default ProfilePage;
