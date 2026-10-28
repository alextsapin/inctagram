import { PostGrid } from '@/entities/post/ui/post-grid';

export const Home = (): React.JSX.Element => {
    return (
        <main className="container">
            <h1>Home</h1>
            <PostGrid />
        </main>
    );
};
