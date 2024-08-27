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
    };
};

const AddQuestion = () => {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();

    const { state } = useLocation();
    console.log(state?.id || 'nope');

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Ajouter une question</CardTitle>
                    <CardDescription>
                        Pour compléter votre feedback ajouter une question.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Ajouter la question"
                        fields={[
                            {
                                name: 'question',
                                label: `Votre nouvelle question`,
                                type: 'textarea',
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

export default AddQuestion;
