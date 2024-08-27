import { Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
} from '@/components/ui/card';
import { Timestamp } from 'firebase/firestore';
import { formatDate } from '@/lib/authUtils';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase';
import { useEffect, useState } from 'react';

interface Feedback {
    organisationId: string;
    titre: string;
    createdAt: string | Timestamp;
    id: string;
}

interface LoaderType {
    feedbacks: Feedback[];
}

const Feedbacks = () => {
    const { feedbacks } = useLoaderData() as LoaderType;
    const navigate = useNavigate();
    const [organisationName, setOrganisationName] = useState('Feedbacks');
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const savedOrganisationName = localStorage.getItem(
                `${userId}_selectedOrganisationName`
            );
            if (savedOrganisationName) {
                setOrganisationName(savedOrganisationName);
            }
        }
    }, []);
    if (!feedbacks) {
        return <Navigate to={'/app/organisations'} />;
    }

    // Fonction pour gérer la redirection vers la sélection d'organisation
    const handleChangeOrganisation = () => {
        navigate('/app/organisations', { state: { from: '/app/feedbacks' } });
    };

    // Fonction pour gérer l'ajout d'un nouveau feedback
    const handleAddFeedback = () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error("Vous n'êtes pas connectez.");
        }
        // Récupérer l'ID de l'organisation depuis le Local Storage
        const organisationId = localStorage.getItem(
            `${userId}_selectedOrganisationId`
        );
        navigate('/app/feedbacks/create', { state: { id: organisationId } });
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">{organisationName}</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
                {feedbacks.map((feedback, index) => (
                    <Card
                        key={index}
                        className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => navigate(`view/${feedback.id}`)}
                    >
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg font-semibold">
                                {feedback.titre}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p></p>
                        </CardContent>
                        <CardFooter className="text-sm text-gray-500">
                            <p>Créé le: {formatDate(feedback.createdAt)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                <Button onClick={handleChangeOrganisation}>
                    Changer d'Organisation
                </Button>
                <Button onClick={handleAddFeedback}>Créer un feedback</Button>
            </div>
        </div>
    );
};

export default Feedbacks;
