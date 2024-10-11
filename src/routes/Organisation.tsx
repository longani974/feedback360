import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { Users, MessageCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { auth, db } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

const Organisation = () => {
    const organisationData = useLoaderData(); // Récupère les données du loader, y compris les crédits
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false); // Pour gérer l'état de chargement
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const { organisationId } = useParams();
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const selectedOrganisationId = localStorage.getItem(
                `${userId}_selectedOrganisationId`
            );
            const adminStatus = localStorage.getItem(
                `${userId}_isAdmin_${selectedOrganisationId}`
            );
            if (adminStatus === 'true') {
                setIsAdmin(true);
            }
        }
    }, []);

    const handlePurchase = async () => {
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
            console.error('Utilisateur non authentifié');
            return;
        }

        setLoading(true); // Démarrage du chargement
        setErrorMessage('');
        setSuccessMessage('');

        const checkoutSessionData = {
            price: 'price_1Q0GYQBKk6QvWOIeIf2cJFs1',
            success_url: `${window.location.origin}/app/checkout/success`,
            cancel_url: window.location.origin,
            mode: 'payment',
            metadata: {
                organisationId: organisationId,
                userId: currentUser.uid,
            },
        };

        try {
            const checkoutSessionRef = await addDoc(
                collection(
                    db,
                    `customers/${currentUser.uid}/checkout_sessions`
                ),
                checkoutSessionData
            );

            onSnapshot(checkoutSessionRef, (snap) => {
                const sessionData = snap.data();
                if (sessionData) {
                    const { error, url } = sessionData;
                    if (error) {
                        setErrorMessage(
                            'Erreur lors de la création de la session : ' +
                                error.message
                        );
                        setLoading(false);
                    } else if (url) {
                        window.location.assign(url); // Redirection vers Stripe
                    }
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(
                    'Erreur lors de la création de la session: ' + error.message
                );
            } else {
                setErrorMessage(
                    'Erreur inconnue lors de la création de la session.'
                );
            }
            setLoading(false); // Fin du chargement en cas d'erreur
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-[350px]">
                    <CardHeader className="text-2xl font-semibold">
                        <CardTitle>Accès aux Feedbacks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-gray-600 mb-4">
                            Vous n'avez pas les droits d'administration, mais
                            vous pouvez consulter et répondre aux feedbacks.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => navigate('/app/feedbacks')}>
                            Accéder aux Feedbacks
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="container mx-auto py-8">
                <div className="mb-4">
                    {isAdmin && (
                        <Button
                            onClick={handlePurchase}
                            disabled={loading} // Désactiver pendant le chargement
                            className={`w-full flex items-center justify-center ${
                                loading ? 'bg-gray-500 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l-5 5h7a8 8 0 11-7 7v-4l5-5H4z"
                                    ></path>
                                </svg>
                            ) : (
                                'Acheter 100 jetons'
                            )}
                        </Button>
                    )}
                </div>

                {errorMessage && (
                    <p className="text-red-500 mt-2">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="text-green-500 mt-2">{successMessage}</p>
                )}

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Gestion de l'Organisation
                        </CardTitle>
                        {/* Affichage des crédits */}

                        <p className="text-lg text-gray-600">
                            Crédits disponibles :{' '}
                            {typeof organisationData === 'object' &&
                            organisationData !== null &&
                            'currentCredits' in organisationData
                                ? (organisationData.currentCredits as number)
                                : 'Non disponible'}
                        </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {isAdmin && (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to="addUser"
                                                state={organisationData}
                                                className="flex-1"
                                            >
                                                <Button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600">
                                                    <Users className="w-5 h-5" />
                                                    Inviter des utilisateurs
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Invitez de nouveaux membres à
                                                rejoindre cette organisation.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to="/app/feedbacks/create"
                                                state={organisationData}
                                                className="flex-1"
                                            >
                                                <Button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600">
                                                    <MessageCircle className="w-5 h-5" />
                                                    Créer un feedback
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Créez un nouveau feedback pour
                                                cette organisation.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <p className="text-sm text-gray-500">
                            Prenez des actions pour améliorer votre
                            organisation.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </TooltipProvider>
    );
};

export default Organisation;
