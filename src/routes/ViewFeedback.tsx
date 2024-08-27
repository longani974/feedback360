import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/authUtils';
import { Link, useLoaderData, useParams, useFetcher } from 'react-router-dom';
import { useState } from 'react';

interface Question {
    id: string;
    createdAt: string;
    question: string;
}

const ViewFeedback = () => {
    const { questions } = useLoaderData() as { questions: Question[] };
    const { campaignId } = useParams();
    const fetcher = useFetcher();
    const [loading, setLoading] = useState(false);

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

        // Utilisation de fetcher pour envoyer une requête de suppression
        await fetcher.submit(
            { questionId },
            {
                method: 'post',
                action: `/app/feedbacks/delete-question/${campaignId}`,
            }
        );

        setLoading(false);
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-semibold mb-4">Questions</h1>
            <div className="space-y-4">
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <div
                            key={question.id}
                            className="border p-4 rounded shadow"
                        >
                            <p className="text-lg">{question.question}</p>
                            <p className="text-sm text-gray-500">
                                Créé le: {formatDate(question.createdAt)}
                            </p>
                            <div className="flex space-x-2 mt-2">
                                <Link
                                    to={`/app/feedbacks/edit-question/${campaignId}/${question.id}`}
                                >
                                    <Button>Modifier</Button>
                                </Link>
                                <Button
                                    onClick={() =>
                                        handleDeleteQuestion(question.id)
                                    }
                                    disabled={loading}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune question trouvée.</p>
                )}
            </div>
            <div className="mt-10">
                <Link to={`/app/feedbacks/add-question/${campaignId}`}>
                    <Button>Ajouter une question</Button>
                </Link>
            </div>
        </div>
    );
};

export default ViewFeedback;
