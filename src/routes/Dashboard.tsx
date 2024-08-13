import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col">
            <div>Dashboard</div>
            <div>Welcome {user?.uid}</div>
            <Link to="/app/add-organisation">
                <Button>Ajouter une organisation</Button>
            </Link>
            <Link to="/app/organisations">
                <Button>Mes organisations</Button>
            </Link>
        </div>
    );
};

export default Dashboard;
