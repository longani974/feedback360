import { Link, useNavigate } from 'react-router-dom';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '../button';
import { AlignRight, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const [showDrawerNav, setShowDrawerNav] = useState(false);
    const navigate = useNavigate();

    const links = [
        { name: 'acceuil', route: '/' },
        { name: 'se connecter', route: '/sign-in' },
        { name: 'créer un compte', route: '/sign-up' },
    ];

    function navigateAndCloseDrawer(route: string) {
        navigate(route);
        setShowDrawerNav(false);
    }

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    Feedback360
                </Link>
                <Drawer
                    open={showDrawerNav}
                    onOpenChange={setShowDrawerNav}
                    direction="left"
                >
                    <DrawerTrigger>
                        <AlignRight />
                    </DrawerTrigger>
                    <DrawerContent className="h-[100%]">
                        <DrawerHeader>
                            <DrawerTitle className="hidden">
                                Navigation
                            </DrawerTitle>
                            <DrawerDescription className="hidden">
                                Connectez vous pour profiter de feedback 360
                            </DrawerDescription>
                            <DrawerClose>
                                <div className="float-right">
                                    <X />
                                </div>
                            </DrawerClose>
                        </DrawerHeader>
                        <div className="flex flex-col gap-3 m-2">
                            {links.map((link) => (
                                <Button
                                    key={link.name}
                                    onClick={() =>
                                        navigateAndCloseDrawer(link.route)
                                    }
                                    variant="outline"
                                >
                                    {link.name}
                                </Button>
                            ))}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </header>
    );
};

export default Header;
