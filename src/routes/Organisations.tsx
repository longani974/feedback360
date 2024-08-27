import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import {
    Organisation,
    UserOrganisationRelation,
} from '@/schemas/firestoreSchela';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { auth } from '@/firebase';

export type OrganisationWithRelation = Organisation & UserOrganisationRelation;

interface LoaderType {
    userOrganisations: OrganisationWithRelation[];
}

const Organisations = () => {
    const { userOrganisations } = useLoaderData() as LoaderType;
    const navigate = useNavigate();

    const handleOrganisationSelect = (
        organisation: OrganisationWithRelation
    ) => {
        const userId = auth.currentUser?.uid;

        if (userId) {
            localStorage.setItem(
                `${userId}_selectedOrganisationId`,
                organisation.id
            );
            localStorage.setItem(
                `${userId}_selectedOrganisationName`,
                organisation.name
            );
        }

        navigate('/app/feedbacks'); // Redirige vers la page des feedbacks après sélection
    };
    return (
        <React.Suspense fallback={<p>Loading package location...</p>}>
            <Await
                resolve={userOrganisations}
                errorElement={<p>Error loading package location!</p>}
            >
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {userOrganisations.map((organisation) => {
                            console.log(organisation);

                            if (!organisation.id) {
                                console.log('isAdmin' in organisation);

                                console.error(
                                    "Il y un problème avec les datas qui viennent de firestore. Il se pourrait qu'un userOrganisationRelation existe alors que organisations qui lui correspond n'existe pas."
                                );
                                return null;
                            }
                            return (
                                <Card
                                    key={organisation.id}
                                    className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300  cursor-pointer"
                                    onClick={() =>
                                        handleOrganisationSelect(organisation)
                                    }
                                >
                                    <CardHeader className="flex flex-row gap-2 border-b">
                                        <Avatar>
                                            <AvatarImage
                                                src={organisation?.image}
                                                alt={organisation.name}
                                                className="w-12 h-12 rounded-full "
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

                                    <CardFooter className="flex justify-end p-4 border-t">
                                        {organisation.isAdmin && (
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-100 text-blue-600"
                                            >
                                                Admin
                                            </Badge>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>{' '}
            </Await>
        </React.Suspense>
    );
};

export default Organisations;
