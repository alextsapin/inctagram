type ProfileProps = {
    username: string;
};

export const Profile = ({ username }: ProfileProps): React.JSX.Element => {
    return (
        <div>
            <h1>Profile: {username}</h1>
        </div>
    );
};
