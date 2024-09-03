import {
    Await,
    useLoaderData,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import {
    Organisation,
    UserOrganisationRelation,
} from '@/schemas/firestoreSchela';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React from 'react';
import { auth } from '@/firebase';
import { Users, PlusCircle } from 'lucide-react'; // Importation d'icônes depuis lucide-react
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';

export type OrganisationWithRelation = Organisation & UserOrganisationRelation;

interface LoaderType {
    userOrganisations: OrganisationWithRelation[];
}

const Organisations = () => {
    const { userOrganisations } = useLoaderData() as LoaderType;
    const navigate = useNavigate();
    const location = useLocation();

    const handleOrganisationSelect = (
        organisation: OrganisationWithRelation
    ) => {
        const userId = auth.currentUser?.uid;
        console.log(organisation);
        if (userId) {
            localStorage.setItem(
                `${userId}_selectedOrganisationId`,
                organisation.id
            );
            localStorage.setItem(
                `${userId}_selectedOrganisationName`,
                organisation.name
            );
            localStorage.setItem(
                `${userId}_isAdmin_${organisation.id}`,
                JSON.stringify(organisation.isAdmin) // Stocke le booléen comme chaîne
            );
        }

        const redirectPath =
            location.state?.from === '/app/feedbacks'
                ? '/app/feedbacks'
                : `/app/organisations/${organisation.id}`;

        navigate(redirectPath);
    };

    const handleCreateOrganisation = () => {
        navigate('/app/add-organisation');
    };

    return (
        <TooltipProvider>
            <React.Suspense fallback={<p>Chargement des organisations...</p>}>
                <Await
                    resolve={userOrganisations}
                    errorElement={
                        <p>Erreur lors du chargement des organisations.</p>
                    }
                >
                    <div className="container mx-auto py-8">
                        {userOrganisations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center">
                                <Users className="w-24 h-24 mb-4 text-gray-400" />
                                <p className="mb-4 text-lg text-gray-700">
                                    Vous n'avez encore aucune organisation.
                                    Créez-en une pour commencer.
                                </p>
                                <Button
                                    onClick={handleCreateOrganisation}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Créer une Organisation
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {userOrganisations.map((organisation) => {
                                    if (!organisation.id) {
                                        console.error(
                                            'Données manquantes pour une organisation.',
                                            organisation
                                        );
                                        return null;
                                    }
                                    return (
                                        <Card
                                            key={organisation.id}
                                            className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                            onClick={() =>
                                                handleOrganisationSelect(
                                                    organisation
                                                )
                                            }
                                        >
                                            <CardHeader className="flex flex-row gap-2 items-center border-b p-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            organisation?.image
                                                        }
                                                        alt={organisation.name}
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                    <AvatarFallback className="text-xl font-bold bg-blue-100">
                                                        {organisation?.name[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle className="text-lg font-semibold">
                                                        {organisation.name}
                                                    </CardTitle>
                                                </div>
                                            </CardHeader>

                                            <CardFooter className="flex justify-between items-center p-4 border-t">
                                                {organisation.isAdmin && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-100 text-blue-600"
                                                    >
                                                        Admin
                                                    </Badge>
                                                )}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="text-blue-600"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Voir les
                                                            utilisateurs
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Await>
            </React.Suspense>
        </TooltipProvider>
    );
};

export default Organisations;
