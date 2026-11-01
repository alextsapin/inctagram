/* eslint-disable prettier/prettier */
import { ConfirmEmail } from '@/pages/confirm-email';

type ConfirmEmailPageProps = {
    searchParams: Promise<{ code?: string }>;
};

const ConfirmEmailPage = async ({searchParams}: ConfirmEmailPageProps): Promise<React.JSX.Element> => {
    const { code } = await searchParams;

    return <ConfirmEmail code={code ?? ''} />;
};

export default ConfirmEmailPage;
