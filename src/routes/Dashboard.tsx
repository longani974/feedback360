import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col">
            <div>Dashboard</div>
            <div>Welcome {user?.uid}</div>
            <Button>
                <Link to="/app/add-organisation">Ajouter une organisation</Link>
            </Button>
        </div>
    );
};

export default Dashboard;
