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
import { db } from '../firebase';
import { useEffect } from 'react';
import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getFunctions, httpsCallable } from 'firebase/functions';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handlePurchase = async () => {
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
            console.error('Utilisateur non authentifié');
            return;
        }

        // Assurez-vous que cet ID est dynamique ou modifié selon votre application
        const organisationId = 'i5dzqgsizhUH82DBHL1r';

        // Construction des données de session
        const checkoutSessionData = {
            price: 'price_1Q0GYQBKk6QvWOIeIf2cJFs1',
            success_url: `${window.location.origin}/app/checkout/success`,
            cancel_url: window.location.origin,
            mode: 'payment',
            metadata: {
                organisationId: organisationId,
                userId: currentUser.uid,
            },
            payment_intent_data: {
                metadata: {
                    organisationId: organisationId,
                },
            },
            subscription_data: {
                metadata: {
                    organisationId: organisationId,
                },
            },
        };

        try {
            // Ajoutez la session de paiement dans Firestore
            const checkoutSessionRef = await addDoc(
                collection(
                    db,
                    `customers/${currentUser.uid}/checkout_sessions`
                ),
                checkoutSessionData
            );

            // Log pour confirmer l'ajout du document dans Firestore
            console.log(
                'Session ajoutée dans Firestore:',
                checkoutSessionRef.id
            );

            // Écoutez les changements sur la session pour obtenir l'URL
            onSnapshot(checkoutSessionRef, (snap) => {
                const sessionData = snap.data();
                console.log(snap.data());
                if (sessionData) {
                    const { error, url } = sessionData;
                    if (error) {
                        console.error(
                            'Erreur lors de la création de la session:',
                            error.message
                        );
                    } else if (url) {
                        window.location.assign(url); // Redirection vers la page de paiement Stripe
                    }
                } else {
                    console.error('Aucune donnée trouvée pour la session.');
                }
            });
        } catch (error) {
            console.error(
                'Erreur lors de la création de la session:',
                error.message
            );
        }
    };

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

    // Fonction pour récupérer les produits

    // Create a query object
    const q = query(collection(db, 'products'), where('active', '==', true));

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(q);
                // Fetch price information for each product
                const productsPromises = querySnapshot.docs.map(
                    async (productDoc) => {
                        const productInfo = productDoc.data();
                        const pricesCollection = collection(
                            productDoc.ref,
                            'prices'
                        );
                        const priceQuerySnapshot =
                            await getDocs(pricesCollection);
                        const priceDoc = priceQuerySnapshot.docs[0];
                        productInfo['priceId'] = priceDoc.id;
                        productInfo['priceInfo'] = priceDoc.data();
                        return productInfo;
                    }
                );

                // 'products' is an array of products with price info
                const products = await Promise.all(productsPromises);
                console.log('Produits et prix récupérés :', products);
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des produits :',
                    error
                );
            }
        };
        // Appeler la fonction pour lister les produits
        fetchProducts();
    }, [q]);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar />
            <div className="flex flex-col">
                <Button onClick={handlePurchase}>Buy Now</Button>
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
