import { LegalPage } from '@/widgets/legal-page';

import { PRIVACY_PARAGRAPHS } from '../model/paragraphs';

export const PrivacyPolicy = (): React.JSX.Element => {
    return <LegalPage title="Privacy Policy" paragraphs={PRIVACY_PARAGRAPHS} />;
};
