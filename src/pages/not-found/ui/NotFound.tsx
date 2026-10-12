import Link from 'next/link';

export const NotFound = (): React.JSX.Element => {
    return (
        <main className="container">
            <h1>Not Found</h1>
            <p>
                <Link href="/">Go home</Link>
            </p>
        </main>
    );
};
