import { ProfileSettings } from '@/pages/profile-settings';

type SettingsPageProps = {
    searchParams: Promise<{ part?: string }>;
};

const SettingsPage = async ({
    searchParams,
}: SettingsPageProps): Promise<React.JSX.Element> => {
    const { part } = await searchParams;

    return <ProfileSettings part={part} />;
};

export default SettingsPage;
