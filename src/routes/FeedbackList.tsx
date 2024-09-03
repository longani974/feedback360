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
import { PlusCircle, ArrowLeftCircle } from 'lucide-react'; // Ajout d'icônes

interface Feedback {
    organisationId: string;
    titre: string;
    createdAt: string | Timestamp;
    id: string;
}

interface UserOrganisationRelation {
    organisationId: string;
    userId: string;
    isAdmin: boolean; // Nouveau champ pour vérifier les droits d'administration
}

interface LoaderType {
    feedbacks: Feedback[];
    userOrganisationRelation: UserOrganisationRelation; // Ajout de la relation de l'utilisateur
}

const Feedbacks = () => {
    const { feedbacks, userOrganisationRelation } =
        useLoaderData() as LoaderType;
    const navigate = useNavigate();
    const [organisationName, setOrganisationName] = useState('Feedbacks');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        console.log(userOrganisationRelation);
        const userId = auth.currentUser?.uid;
        if (userId) {
            const selectedOrganisationId = localStorage.getItem(
                `${userId}_selectedOrganisationId`
            );
            const savedOrganisationName = localStorage.getItem(
                `${userId}_selectedOrganisationName`
            );
            if (savedOrganisationName) {
                setOrganisationName(savedOrganisationName);
            }
            const adminStatus = localStorage.getItem(
                `${userId}_isAdmin_${selectedOrganisationId}`
            );
            // Vérifier si l'utilisateur est admin
            if (adminStatus === 'true') {
                setIsAdmin(true);
            }
        }
    }, [userOrganisationRelation]);

    if (!feedbacks) {
        return <Navigate to={'/app/organisations'} />;
    }

    // Fonction pour gérer la redirection vers la sélection d'organisation
    const handleChangeOrganisation = () => {
        navigate('/app/organisations', { state: { from: '/app/feedbacks' } });
    };

    // Fonction pour gérer l'ajout d'un nouveau feedback
    const handleAddFeedback = () => {
        if (!isAdmin) {
            alert("Vous n'avez pas les droits pour créer un feedback.");
            return;
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error("Vous n'êtes pas connecté.");
        }
        // Récupérer l'ID de l'organisation depuis le Local Storage
        const organisationId = localStorage.getItem(
            `${userId}_selectedOrganisationId`
        );
        navigate('/app/feedbacks/create', { state: { id: organisationId } });
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">{organisationName}</h1>
                {isAdmin && ( // Afficher le bouton seulement si l'utilisateur est admin
                    <Button
                        onClick={handleAddFeedback}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Créer un feedback
                    </Button>
                )}
            </div>
            {feedbacks.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <ArrowLeftCircle className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="mb-4 text-lg text-gray-700">
                        {isAdmin
                            ? 'Aucun feedback trouvé. Créez un nouveau feedback pour commencer.'
                            : 'Aucun feedback trouvé.'}
                    </p>
                    {isAdmin && ( // Afficher le bouton seulement si l'utilisateur est admin
                        <Button
                            onClick={handleAddFeedback}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Créer un feedback
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
                    {feedbacks.map((feedback) => (
                        <Card
                            key={feedback.id}
                            className="border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => navigate(`view/${feedback.id}`)}
                        >
                            <CardHeader className="border-b p-4">
                                <CardTitle className="text-lg font-semibold">
                                    {feedback.titre}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p>Contenu du feedback...</p>{' '}
                                {/* Ajoutez ici un extrait ou une description */}
                            </CardContent>
                            <CardFooter className="p-4 text-sm text-gray-500">
                                Créé le: {formatDate(feedback.createdAt)}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            <div className="flex justify-between items-center mt-6">
                <Button
                    onClick={handleChangeOrganisation}
                    className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                    <ArrowLeftCircle className="w-5 h-5" />
                    Changer d'Organisation
                </Button>
            </div>
        </div>
    );
};

export default Feedbacks;
