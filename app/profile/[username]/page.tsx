import { Profile } from '@/pages/profile';

type ProfilePageProps = {
    params: Promise<{ username: string }>;
};

const ProfilePage = async ({ params }: ProfilePageProps): Promise<React.JSX.Element> => {
    const { username } = await params;

    return <Profile username={username} />;
};

export default ProfilePage;
