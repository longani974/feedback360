import { AuthForm } from '@/components/AuthForm';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { useEffect } from 'react';
import { useActionData, useNavigate, useNavigation } from 'react-router-dom';

type ActionData = {
    success?: boolean;
    error?: string;
    errors?: {
        email?: string[];
    };
};

const AddUser = () => {
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
                    <CardTitle>Inviter une personne</CardTitle>
                    <CardDescription>
                        Invitez une personne pour lui proposer des
                        questionnaires.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Ajouter l'Utilisateur"
                        fields={[
                            {
                                name: 'email',
                                label: `Email de l'Utilisateur`,
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

export default AddUser;
