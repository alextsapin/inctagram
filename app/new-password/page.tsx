import { NewPassword } from '@/pages/new-password';

// searchParams — это promise, который превращается в объект с параметрами текущего адреса.
// Next автоматически отдаёт его компоненту из файла page.tsx
type NewPasswordPageProps = {
    searchParams: Promise<{ code?: string }>;
};

// Сюда ведёт ссылка из письма: /new-password?code=...
// Код читаем из адреса здесь, на сервере, и передаём странице обычным пропом
const NewPasswordPage = async ({
    searchParams,
}: NewPasswordPageProps): Promise<React.JSX.Element> => {
    const { code } = await searchParams;

    // Если кода в ссылке нет, передаём пустую строку: страница покажет «ссылка истекла»
    return <NewPassword code={code ?? ''} />;
};

export default NewPasswordPage;
