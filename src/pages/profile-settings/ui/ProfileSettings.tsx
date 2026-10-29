'use client';

import { useState } from 'react';

import { useCurrentUser } from '@/entities/session';
import { ProfilePhoto } from '@/features/change-profile-photo';
import { EditProfileForm } from '@/features/edit-profile';
import { Tabs, type TabOption } from '@/shared/ui/tabs';
import { Sidebar } from '@/widgets/sidebar';

import css from './profile-settings.module.scss';

const SETTINGS_TABS: TabOption[] = [
    { value: 'info', label: 'General information' },
    { value: 'devices', label: 'Devices' },
    { value: 'account', label: 'Account Management' },
    { value: 'payments', label: 'My payments' },
];

type ProfileSettingsProps = {
    part?: string;
};

export const ProfileSettings = ({ part }: ProfileSettingsProps): React.JSX.Element => {
    const { data: user } = useCurrentUser();

    const [activeTab, setActiveTab] = useState<string>(part ?? 'info');

    return (
        <div className={css.layout}>
            <Sidebar />

            <main className={css.settings}>
                <h1 className={css.title}>Profile Settings</h1>

                <Tabs
                    options={SETTINGS_TABS}
                    value={activeTab}
                    onChange={setActiveTab}
                    fullWidth
                    aria-label="Profile settings tabs"
                >
                    {activeTab === 'info' && user && (
                        <EditProfileForm
                            username={user.username}
                            photo={<ProfilePhoto />}
                        />
                    )}
                </Tabs>
            </main>
        </div>
    );
};
