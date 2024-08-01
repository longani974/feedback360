import { Button } from '@/components/ui/button';
import { CircleUser } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SideBar from '@/components/SideBar';
import SideBarMobile from '@/components/SideBarMobile';
import { getPageTitle } from '@/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Utilisation d'une image par défaut ou d'un avatar générique
    // const initialUserAvatar = user?.photoURL || '';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/sign-in');
        } catch (error) {
            console.error('Logout failed:', error);
            // Optionnel : Afficher un message d'erreur à l'utilisateur
        }
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar />
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    {/* SIDEBAR Mobile */}
                    <SideBarMobile />
                    {/* TOP MENU SEARCH BAR */}
                    <div className="w-full flex-1">
                        {/* La barre de recherche pourrait être activée ici */}
                    </div>
                    {/* USER PROFILE */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                <div>{user?.email}</div>
                                <Avatar>
                                    <AvatarFallback>
                                        {user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="User Avatar"
                                            />
                                        ) : (
                                            <CircleUser className="h-5 w-5" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="sr-only">
                                    Toggle user menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link to="/app/profile">
                                <DropdownMenuItem className="cursor-pointer">
                                    Modifier
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={handleLogout}
                            >
                                Me déconnecter
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                {/* CONTENT */}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">
                            {getPageTitle(location.pathname)}
                        </h1>
                    </div>
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
