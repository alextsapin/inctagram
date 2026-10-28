'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCurrentUser } from '@/entities/session';
// TODO: Раскомментировать после merge PR.
// import { ProfilePhoto } from '@/features/change-profile-photo';
// import { EditProfileForm } from '@/features/edit-profile';
import { Sidebar } from '@/widgets/sidebar';

import css from './profile-settings.module.scss';

const SETTINGS_TABS = [
    'General information',
    'Devices',
    'Account Management',
    'My payments',
] as const;

// Сопоставление вкладки с параметром URL (part) и обратно.
const TAB_TO_PART: Record<string, string> = {
    'General information': 'info',
    Devices: 'devices',
    'Account Management': 'account',
    'My payments': 'payments',
};

const PART_TO_TAB: Record<string, string> = {
    info: 'General information',
    devices: 'Devices',
    account: 'Account Management',
    payments: 'My payments',
};

export const ProfileSettings = (): React.JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: user } = useCurrentUser();

    const part = searchParams?.get('part');
    const [activeTab, setActiveTab] = useState<string>(
        (part && PART_TO_TAB[part]) || SETTINGS_TABS[0],
    );

    const handleTabClick = (tab: string): void => {
        setActiveTab(tab);
        router.replace(`/profile/settings?part=${TAB_TO_PART[tab]}`);
    };

    return (
        <div className={css.layout}>
            <Sidebar />

            <main className={css.settings}>
                <h1 className={css.title}>Profile Settings</h1>

                <div
                    className={css.tabs}
                    role="tablist"
                    aria-label="Profile settings tabs"
                >
                    {SETTINGS_TABS.map(tab => (
                        <button
                            key={tab}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab}
                            className={[css.tab, activeTab === tab && css['tab-active']]
                                .filter(Boolean)
                                .join(' ')}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'General information' && user && (
                    <>
                        {/* TODO: Раскомментировать после merge PR. */}
                        {/* <EditProfileForm
                            username={user.username}
                            photo={<ProfilePhoto />}
                        /> */}
                    </>
                )}
            </main>
        </div>
    );
};
