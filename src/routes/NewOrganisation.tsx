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
import {
    useActionData,
    useNavigate,
    useNavigation,
    useLoaderData,
} from 'react-router-dom';

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
    const { hasOrganisation } = useLoaderData() as { hasOrganisation: boolean };
    const navigation = useNavigation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(actionData);
        if (actionData?.success) {
            navigate('/app');
        }
    }, [actionData, navigate]);
    // Si l'utilisateur a déjà une organisation, on redirige vers la page principale

    if (hasOrganisation) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-[350px] p-4">
                    <CardHeader>
                        <CardTitle>Organisation existante</CardTitle>
                        <CardDescription>
                            Vous avez déjà créé une organisation. Actuellement,
                            vous ne pouvez créer qu'une seule organisation par
                            compte.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Si vous souhaitez gérer plusieurs organisations,
                            cette fonctionnalité sera bientôt disponible dans
                            une future version de Feedback360. Restez à l'affût
                            des mises à jour !
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500">
                            Pour toute question, n'hésitez pas à nous contacter.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

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
