import { LegalPage } from '@/widgets/legal-page';

import { TERMS_PARAGRAPHS } from '../model/paragraphs';

export const TermsOfService = (): React.JSX.Element => {
    return <LegalPage title="Terms of Service" paragraphs={TERMS_PARAGRAPHS} />;
};
