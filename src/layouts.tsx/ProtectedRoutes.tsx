// import { useUser } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
// import { account } from '@/lib/appWrite/config';
// import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/sign-in');
    };

    return (
        <>
            <div>DashboardLayout</div>
            <Outlet />
            <Button onClick={handleLogout}>Logout</Button>
        </>
    );
};

export default ProtectedRoutes;
