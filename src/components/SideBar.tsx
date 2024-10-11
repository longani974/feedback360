import { Home, MessageSquare, User, Drama } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLinkClassName } from '@/utils';

const SideBar = () => {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                {/* ---------------------------------------- */}
                {/* HEADER */}
                {/* ---------------------------------------- */}
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <Drama className="h-6 w-6" />
                        <span className="">Feedback 360</span>
                    </Link>
                    {/* <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto h-8 w-8"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button> */}
                </div>
                {/* ---------------------------------------- */}
                {/* NAVIGATION */}
                {/* ---------------------------------------- */}

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
                </div>
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
                {/* ---------------------------------------- */}
            </div>
        </div>
    );
};

export default SideBar;
