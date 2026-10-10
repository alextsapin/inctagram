import { Header } from '@/widgets/header';

type ProfileProps = {
    username: string;
};

export const Profile = ({ username }: ProfileProps): React.JSX.Element => {
    return (
        <>
            <Header />
            <main className="container">
                <h1>Profile: {username}</h1>
            </main>
        </>
    );
};
