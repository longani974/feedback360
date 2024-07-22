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
import { avatars } from '@/lib/appWrite/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const initialUserAvatar = avatars
        .getInitials(user?.name || user?.email)
        .toString();

    const handleLogout = async () => {
        await logout();
        navigate('/sign-in');
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar />
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    {/* ---------------------------------------- */}
                    {/* SIDEBAR Mobile */}
                    {/* ---------------------------------------- */}
                    <SideBarMobile />
                    {/* ---------------------------------------- */}
                    {/* TOP MENU SEARCH BAR */}
                    {/* ---------------------------------------- */}
                    <div className="w-full flex-1">
                        {/* <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form> */}
                    </div>
                    {/* ---------------------------------------- */}
                    {/* USER PROFILE */}
                    {/* ---------------------------------------- */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                {/* <CircleUser className="h-5 w-5" /> */}
                                <Avatar>
                                    <AvatarImage src={initialUserAvatar} />
                                    <AvatarFallback>
                                        <CircleUser className="h-5 w-5" />
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
                                    Modifer
                                </DropdownMenuItem>
                            </Link>
                            {/* <DropdownMenuItem>Aide</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                {' '}
                                Me déconnecter
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                {/* ---------------------------------------- */}
                {/* CONTENT */}
                {/* ---------------------------------------- */}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">
                            {getPageTitle(location.pathname)}
                        </h1>
                    </div>
                    <div
                        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                        x-chunk="dashboard-02-chunk-1"
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
