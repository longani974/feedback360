import { Menu, Package2, Home, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { getLinkClassName } from '@/utils';

const SideBarMobile = () => {
    return (
        <Sheet>
            {/* ---------------------------------------- */}
            {/* Burger */}
            {/* ---------------------------------------- */}
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            {/* ---------------------------------------- */}
            {/* DRAWER */}
            {/* ---------------------------------------- */}
            <SheetContent side="left" className="flex flex-col">
                {/* ---------------------------------------- */}
                {/* NAVIGATION */}
                {/* ---------------------------------------- */}
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="">Feedback 360</span>
                    </Link>
                    <Link to="/app" className={getLinkClassName('/app', true)}>
                        <Home className="h-4 w-4" />
                        Tableau de bord
                    </Link>
                    <Link
                        to="/app/feedbacks"
                        className={getLinkClassName('/app/feedbacks')}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Feedbacks
                    </Link>
                    <div className="hidden">
                        <Link
                            to="/app/profile"
                            className={getLinkClassName('/app/profile')}
                        >
                            <User className="h-4 w-4" />
                            Mon profile
                        </Link>
                    </div>
                </nav>
                {/* ---------------------------------------- */}
                {/* FOOTER */}
                {/* ---------------------------------------- */}
                {/* <div className="mt-auto p-4">
                    <Card x-chunk="dashboard-02-chunk-0">
                        <CardHeader className="p-2 pt-0 md:p-4">
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to
                                our support team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                            <Button size="sm" className="w-full">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </div> */}
            </SheetContent>
        </Sheet>
    );
};

export default SideBarMobile;
