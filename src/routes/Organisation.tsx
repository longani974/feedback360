import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Link, useLoaderData } from 'react-router-dom';
import { Users, MessageCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { auth } from '@/firebase';

const Organisation = () => {
    const organisationData = useLoaderData();
    const [isAdmin, setIsAdmin] = useState(false);

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

    return (
        <TooltipProvider>
            <div className="container mx-auto py-8">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Gestion de l'Organisation
                        </CardTitle>
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
