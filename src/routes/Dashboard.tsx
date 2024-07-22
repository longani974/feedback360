import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <>
            <div>Dashboard</div>
            <div>Welcome {user?.name}</div>
        </>
    );
};

export default Dashboard;
