import { Button } from './ui/button';
import {
    Home,
    Bell,
    CircleUser,
    Menu,
    Package2,
    Search,
    User,
    MessageSquare,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from './ui/card';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

const SideBar = () => {
    const location = useLocation();

    // Fonction pour vérifier si le chemin actuel commence par le chemin fourni
    const isActive = (path: string, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getLinkClassName = (path: string, exact = false) => {
        const baseClass =
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary';
        return isActive(path, exact)
            ? `${baseClass} bg-muted text-primary`
            : baseClass;
    };

    const getPageTitle = (pathname: string) => {
        const path = pathname.replace('/app', '').split('/')[1] || '';
        switch (path) {
            case '':
                return 'Tableau de bord';
            case 'feedbacks':
                return 'Feedbacks';
            case 'profile':
                return 'Mon profil';
            default:
                return 'Page';
        }
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="">Feedback 360</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto h-8 w-8"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">
                                Toggle notifications
                            </span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                to="/app"
                                className={getLinkClassName('/app', true)}
                            >
                                <Home className="h-4 w-4" />
                                Tableau de bord
                            </Link>
                            <Link
                                to="/app/feedbacks"
                                className={getLinkClassName('/app/feedbacks')}
                            >
                                <MessageSquare className="h-4 w-4" />
                                Feedbacks
                                {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              6
          </Badge> */}
                            </Link>
                            <Link
                                to="/app/profile"
                                className={getLinkClassName('/app/profile')}
                            >
                                <User className="h-4 w-4" />
                                Mon profile
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <Card x-chunk="dashboard-02-chunk-0">
                            <CardHeader className="p-2 pt-0 md:p-4">
                                <CardTitle>Upgrade to Pro</CardTitle>
                                <CardDescription>
                                    Unlock all features and get unlimited access
                                    to our support team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                <Button size="sm" className="w-full">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 font-semibold"
                                >
                                    <Package2 className="h-6 w-6" />
                                    <span className="">Feedback 360</span>
                                </Link>
                                <Link
                                    to="/app"
                                    className={getLinkClassName('/app', true)}
                                >
                                    <Home className="h-4 w-4" />
                                    Tableau de bord
                                </Link>
                                <Link
                                    to="/app/feedbacks"
                                    className={getLinkClassName(
                                        '/app/feedbacks'
                                    )}
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Feedbacks
                                </Link>
                                <Link
                                    to="/app/profile"
                                    className={getLinkClassName('/app/profile')}
                                >
                                    <User className="h-4 w-4" />
                                    Mon profile
                                </Link>
                            </nav>
                            <div className="mt-auto p-4">
                                <Card x-chunk="dashboard-02-chunk-0">
                                    <CardHeader className="p-2 pt-0 md:p-4">
                                        <CardTitle>Upgrade to Pro</CardTitle>
                                        <CardDescription>
                                            Unlock all features and get
                                            unlimited access to our support
                                            team.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                        <Button size="sm" className="w-full">
                                            Upgrade
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle user menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Modifer</DropdownMenuItem>
                            {/* <DropdownMenuItem>Aide</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Me déconnecter</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
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

export default SideBar;
