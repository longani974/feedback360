import { AuthForm } from '@/components/AuthForm';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { useActionData, useLocation, useNavigation } from 'react-router-dom';

type ActionData = {
    success?: boolean;
    error?: string;
    errors?: {
        titre?: string[];
        endDate?: string[];
    };
};

const CreateFeedback = () => {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();

    const { state } = useLocation();
    console.log(state?.id || 'nope');

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Créer un feedback</CardTitle>
                    <CardDescription>
                        Une fois le questionnaire créé, vous pourrez ajouter vos
                        questions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Créer le feedback"
                        fields={[
                            {
                                name: 'titre',
                                label: `Nom du feedback`,
                                type: 'text',
                            },
                            {
                                name: 'startDate',
                                label: 'Date de début',
                                type: 'date',
                            },
                            {
                                name: 'endDate',
                                label: 'Date de fin',
                                type: 'date',
                            },
                            {
                                name: 'organisationId',
                                label: '',
                                type: 'hidden',
                                value: state?.id || undefined,
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

export default CreateFeedback;
