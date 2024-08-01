import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Assurez-vous que le chemin d'importation est correct

const ProtectedRoutes = () => {
    const { user } = useAuth();

    return user ? <Outlet /> : <Navigate to={'/sign-in'} />; // Affiche les enfants si l'utilisateur est authentifié
};

export default ProtectedRoutes;
