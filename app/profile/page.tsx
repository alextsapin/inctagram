import type { Metadata } from 'next';

import { MyProfile } from '@/pages/my-profile';

export const metadata: Metadata = {
    title: 'My Profile | Inctagram',
    description: 'Your profile on Inctagram',
};

const MyProfilePage = (): React.JSX.Element => {
    return <MyProfile />;
};

export default MyProfilePage;
