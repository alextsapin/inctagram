import type { Metadata } from 'next';

import { ProfileRedirect } from '@/pages/my-profile';

export const metadata: Metadata = {
    title: 'My Profile | Inctagram',
    description: 'Your profile on Inctagram',
};

const MyProfilePage = (): React.JSX.Element => {
    return <ProfileRedirect />;
};

export default MyProfilePage;
