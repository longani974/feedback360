import { useLoaderData } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Response {
    responseText: string;
    updatedAt: {
        _seconds: number;
        _nanoseconds: number;
    };
}

interface Question {
    questionText: string;
    responses: Response[];
}

const Report = () => {
    const data = useLoaderData() as { questions: Question[] };

    if (!data || !data.questions || data.questions.length === 0) {
        return (
            <div className="text-center mt-4">
                <p>Aucune donnée disponible.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-6">
                Rapport de Réponses Compilées
            </h1>
            <div className="space-y-6">
                {data.questions.map((question, index) => (
                    <Card
                        key={index}
                        className="shadow-lg rounded-lg border border-gray-200"
                    >
                        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                            <h2 className="text-xl font-semibold">
                                Question #{index + 1}
                            </h2>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="mb-2 text-gray-700 font-medium">
                                {question.questionText}
                            </div>
                            <div>
                                {question.responses.length === 0 ? (
                                    <p>Aucune réponse disponible.</p>
                                ) : (
                                    question.responses.map((response, i) => (
                                        <div
                                            key={i}
                                            className="mb-4 p-4 border border-gray-200 rounded"
                                        >
                                            <p>{response.responseText}</p>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(
                                                    response.updatedAt
                                                        ._seconds * 1000
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 text-right">
                            <Button className="hidden bg-blue-600 text-white hover:bg-blue-700">
                                Détail
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Report;
