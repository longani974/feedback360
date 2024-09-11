import { AuthForm } from '@/components/AuthForm';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { useActionData, useLoaderData, useNavigation } from 'react-router-dom';

type ActionData = {
    success?: boolean;
    error?: string;
    errors?: {
        question?: string[];
    };
};

type QuestionData = {
    question: string;
};

const EditQuestion = () => {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();
    const { question } = useLoaderData() as QuestionData;

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Modifier la question</CardTitle>
                    <CardDescription>
                        Modifiez votre question pour mettre à jour le feedback.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Mettre à jour la question"
                        fields={[
                            {
                                name: 'question',
                                label: `Votre question`,
                                type: 'textarea',
                                value: question, // Pré-remplir avec la question actuelle
                            },
                        ]}
                        isSubmitting={navigation.state === 'submitting'}
                        error={actionData?.error}
                        fieldErrors={actionData?.errors}
                    />
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        </div>
    );
};

export default EditQuestion;
