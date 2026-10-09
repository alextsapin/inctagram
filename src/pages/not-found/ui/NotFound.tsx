import Link from 'next/link';

export const NotFound: React.FC = () => {
    return (
        <main>
            <h1>404</h1>
            <p>Page not found</p>

            <Link href="/">Back to Home</Link>
        </main>
    );
};
