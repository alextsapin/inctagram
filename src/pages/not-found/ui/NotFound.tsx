import Link from 'next/link';

export const NotFound: React.FC = () => {
    return (
        <main className="container">
            <h1>Error 404! Page not found!</h1>
            <Link href="/">Back to Home</Link>
        </main>
    );
};
