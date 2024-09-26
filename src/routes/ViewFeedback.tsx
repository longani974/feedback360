import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/authUtils';
import { Link, useLoaderData, useParams, useFetcher } from 'react-router-dom';
import { auth } from '@/firebase';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from '@/components/ui/tooltip';
import { Timestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase'; // Assurez-vous que cela pointe vers votre config Firebase Functions

interface Question {
    id: string;
    createdAt: string;
    question: string;
}

interface Response {
    id: string;
    responseText: string;
    userId: string;
    updatedAt: unknown;
}

const ViewFeedback = () => {
    const { questions, responsesMap, titre, endDate, startDate } =
        useLoaderData() as {
            questions: Question[];
            responsesMap: Record<string, Response | null>;
            titre: string;
            endDate: Date;
            startDate: Date;
        };

    const { campaignId } = useParams();
    const fetcher = useFetcher();
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [responseText, setResponseText] = useState<{ [key: string]: string }>(
        {}
    );
    const [hasChanges, setHasChanges] = useState<{ [key: string]: boolean }>(
        {}
    );
    const currentDate = new Date();

    // New state variables for title and date editing
    const [editTitle, setEditTitle] = useState(titre);
    const [editStartDate, setEditStartDate] = useState(
        startDate instanceof Timestamp
            ? startDate.toDate()
            : new Date(startDate)
    );
    const [editEndDate, setEditEndDate] = useState(
        endDate instanceof Timestamp ? endDate.toDate() : new Date(endDate)
    );

    // State for tracking initial values
    const [initialTitle, setInitialTitle] = useState(titre);
    const [initialStartDate, setInitialStartDate] = useState(
        startDate instanceof Timestamp
            ? startDate.toDate()
            : new Date(startDate)
    );
    const [initialEndDate, setInitialEndDate] = useState(
        endDate instanceof Timestamp ? endDate.toDate() : new Date(endDate)
    );

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleDeleteQuestion = async (questionId: string) => {
        if (!campaignId) {
            console.error('ID de la campagne non trouvé.');
            return;
        }

        const confirmed = window.confirm(
            'Êtes-vous sûr de vouloir supprimer cette question ?'
        );
        if (!confirmed) return;

        setLoading(true);

        await fetcher.submit(
            { questionId },
            {
                method: 'post',
                action: `/app/feedbacks/delete-question/${campaignId}`,
            }
        );

        setLoading(false);
    };

    const handleAddOrUpdateResponse = async (questionId: string) => {
        if (!campaignId) {
            console.error('ID de la campagne non trouvé.');
            return;
        }

        const currentResponseText = responseText[questionId] || '';
        if (!currentResponseText) {
            console.error('Aucune réponse fournie.');
            return;
        }

        setLoading(true);

        await fetcher.submit(
            { responseText: currentResponseText },
            {
                method: 'post',
                action: `/app/feedbacks/add-response/${campaignId}/${questionId}`,
            }
        );

        setLoading(false);
    };

    useEffect(() => {
        const initialResponseText: { [key: string]: string } = {};
        const initialHasChanges: { [key: string]: boolean } = {};
        for (const question of questions) {
            const response = responsesMap[question.id];
            if (response) {
                initialResponseText[question.id] = response.responseText;
            } else {
                initialResponseText[question.id] = '';
            }
            initialHasChanges[question.id] = false;
        }
        setResponseText(initialResponseText);
        setHasChanges(initialHasChanges);
    }, [questions, responsesMap]);

    const handleTextChange = (questionId: string, text: string) => {
        setResponseText((prev) => ({
            ...prev,
            [questionId]: text,
        }));
        setHasChanges((prev) => ({
            ...prev,
            [questionId]: text !== responsesMap[questionId]?.responseText,
        }));
    };

    // Nouvelle fonction pour déclencher la compilation des réponses
    async () => {
        if (!campaignId) {
            console.error('ID de la campagne non trouvé.');
            return;
        }

        setLoading(true);

        try {
            // Appel à la fonction cloud pour compiler les réponses
            const compileResponses = httpsCallable(
                functions,
                'compileResponses'
            );
            const result = await compileResponses({ feedbackId: campaignId });
            console.log('Compiled responses:', result.data);
            alert('Les réponses ont été compilées avec succès!');
        } catch (error) {
            console.error('Error compiling responses:', error);
            alert('Erreur lors de la compilation des réponses.');
        }

        setLoading(false);
    };

    // Convertir endDate et startDate si nécessaire
    const endDateAsDate =
        endDate instanceof Timestamp ? endDate.toDate() : new Date(endDate);
    const startDateAsDate =
        startDate instanceof Timestamp
            ? startDate.toDate()
            : new Date(startDate);

    // Vérifier si la date actuelle est après la date de fin
    const isPastEndDate = currentDate > endDateAsDate;

    // Vérifier si la date actuelle est avant la date de début
    const isBeforeStartDate = currentDate < startDateAsDate;

    // Function to check if changes have been made
    const hasMadeChanges =
        editTitle !== initialTitle ||
        editStartDate.getTime() !== initialStartDate.getTime() ||
        editEndDate.getTime() !== initialEndDate.getTime();

    // Function to handle title and date submission
    const handleSaveChanges = async () => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await fetcher.submit(
                {
                    titre: editTitle,
                    startDate: editStartDate.toISOString(),
                    endDate: editEndDate.toISOString(),
                },
                {
                    method: 'post',
                    action: `/app/feedbacks/update-campaign/${campaignId}`,
                }
            );
            // Update the initial values to reflect the newly saved values
            setInitialTitle(editTitle);
            setInitialStartDate(editStartDate);
            setInitialEndDate(editEndDate);

            setSuccessMessage('Changements sauvegardés avec succès !');
        } catch (error) {
            setErrorMessage('Erreur lors de la sauvegarde. Réessayez.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <div className="container mx-auto py-8">
                {isAdmin ? (
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">
                            Modifier le titre
                        </label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    </div>
                ) : (
                    <h1 className="text-2xl font-semibold mb-4">{titre}</h1>
                )}

                {isAdmin ? (
                    <div className="flex gap-4 mb-4">
                        <div>
                            <label className="block text-lg font-semibold mb-2">
                                Date de début
                            </label>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={
                                    editStartDate.toISOString().split('T')[0]
                                }
                                onChange={(e) =>
                                    setEditStartDate(new Date(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-2">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={editEndDate.toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setEditEndDate(new Date(e.target.value))
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-lg mb-4">
                            Date de début: {formatDate(startDate)}
                        </p>
                        <p className="text-lg mb-4">
                            Date de fin: {formatDate(endDate)}
                        </p>
                    </>
                )}

                {isAdmin && (
                    <div className="mt-4 mb-8 pb-8 border-b-8">
                        <Button
                            onClick={handleSaveChanges}
                            disabled={loading || !hasMadeChanges}
                            className={`flex items-center space-x-2 ${
                                loading || !hasMadeChanges
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                                'Sauvegarder les changements'
                            )}
                        </Button>

                        {successMessage && (
                            <p className="text-green-500 mt-2">
                                Changements sauvegardés avec succès !
                            </p>
                        )}

                        {errorMessage && (
                            <p className="text-red-500 mt-2">
                                Erreur lors de la sauvegarde. Réessayez.
                            </p>
                        )}
                    </div>
                )}

                {/* Rest of your component */}
                <div className="space-y-4">
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <div
                                key={question.id}
                                className={`border p-4 rounded shadow ${
                                    isPastEndDate ? 'bg-gray-100' : ''
                                }`}
                            >
                                <p className="text-lg">{question.question}</p>
                                <p className="text-sm text-gray-500">
                                    Créé le: {formatDate(question.createdAt)}
                                </p>
                                {isAdmin && isBeforeStartDate && (
                                    <div className="flex space-x-2 mt-2">
                                        <Link
                                            to={`/app/feedbacks/edit-question/${campaignId}/${question.id}`}
                                        >
                                            <Button>Modifier</Button>
                                        </Link>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteQuestion(
                                                            question.id
                                                        )
                                                    }
                                                    disabled={loading}
                                                >
                                                    Supprimer
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Confirmez la suppression de
                                                    la question pour activer ce
                                                    bouton.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}

                                {!isBeforeStartDate && (
                                    <div className="mt-4">
                                        <textarea
                                            placeholder="Écrivez votre réponse ici..."
                                            rows={3}
                                            className={`w-full p-2 border rounded ${
                                                hasChanges[question.id]
                                                    ? 'border-blue-500'
                                                    : ''
                                            }`}
                                            value={
                                                responseText[question.id] || ''
                                            }
                                            onChange={(e) =>
                                                !isPastEndDate &&
                                                handleTextChange(
                                                    question.id,
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                isPastEndDate ||
                                                isBeforeStartDate
                                            } // Désactiver le textarea si hors période
                                        />
                                        {loading || !hasChanges[question.id] ? (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {!isPastEndDate &&
                                                        !isBeforeStartDate && (
                                                            <Button
                                                                onClick={() =>
                                                                    handleAddOrUpdateResponse(
                                                                        question.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading ||
                                                                    !hasChanges[
                                                                        question
                                                                            .id
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            >
                                                                {responsesMap[
                                                                    question.id
                                                                ]
                                                                    ? 'Modifier la réponse'
                                                                    : 'Ajouter une réponse'}
                                                            </Button>
                                                        )}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Ajoutez ou modifiez
                                                        votre réponse en
                                                        saisissant du texte dans
                                                        le champ ci-dessus.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    !isPastEndDate &&
                                                    !isBeforeStartDate &&
                                                    handleAddOrUpdateResponse(
                                                        question.id
                                                    )
                                                }
                                                disabled={
                                                    loading ||
                                                    !hasChanges[question.id] ||
                                                    isPastEndDate ||
                                                    isBeforeStartDate
                                                }
                                                className="mt-2"
                                            >
                                                {responsesMap[question.id]
                                                    ? 'Modifier la réponse'
                                                    : 'Ajouter une réponse'}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Aucune question trouvée.</p>
                    )}
                </div>
                {isAdmin && isBeforeStartDate && (
                    <div className="mt-10">
                        <Link to={`/app/feedbacks/add-question/${campaignId}`}>
                            <Button>Ajouter une question</Button>
                        </Link>
                    </div>
                )}
                {isPastEndDate && (
                    <div>
                        <div className="mt-10">
                            <Link to={`/app/feedbacks/report/${campaignId}`}>
                                <Button disabled={loading}>
                                    Voir le rapport
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};

export default ViewFeedback;
