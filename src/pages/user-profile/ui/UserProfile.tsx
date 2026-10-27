import type { JSX } from 'react';

import { ProfilePage } from '@/pages/profile';

type UserProfileProps = {
    username: string;
};

export const UserProfile = ({ username }: UserProfileProps): JSX.Element => {
    return <ProfilePage username={username} />;
};
