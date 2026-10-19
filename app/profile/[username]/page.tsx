import type { Metadata } from 'next';

import { Profile } from '@/pages/profile';

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

    return <Profile username={username} />;
};

export default ProfilePage;
