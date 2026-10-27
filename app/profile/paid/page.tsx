import type { Metadata } from 'next';

import { MyProfile } from '@/pages/my-profile';

export const metadata: Metadata = {
    title: 'My Profile (paid) | Inctagram',
    description: 'Your verified profile on Inctagram',
};

const MyProfilePaidPage = (): React.JSX.Element => {
    return <MyProfile isVerified />;
};

export default MyProfilePaidPage;
