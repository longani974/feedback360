import { AuthForm } from '@/components/AuthForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useEffect } from 'react';
import { useActionData, useNavigate, useNavigation } from 'react-router-dom';

type ActionData = {
    success?: boolean;
    error?: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
};

const NewOrganisation = () => {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(actionData);
        if (actionData?.success) {
            navigate('/app');
        }
    }, [actionData, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Créer votre organisation</CardTitle>
                    <CardDescription>
                        Vous pourrez ensuite inviter des personnes et leur
                        proposer des questionnaires.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Créer l'organisation"
                        fields={[
                            {
                                name: 'name',
                                label: `Nom de l'organisation`,
                                type: 'text',
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

export default NewOrganisation;
