import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AuthForm } from '../components/AuthForm';
import { Link } from 'react-router-dom';
import { useActionData, useNavigate, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Models } from 'appwrite';

type ActionData = {
    success?: boolean;
    user?: Models.User<Models.Preferences>;
    error?: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
    alreadyLoggedIn?: boolean;
};

export default function Login() {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        if (actionData?.success && actionData.user) {
            setUser(actionData.user);
            // if (actionData.alreadyLoggedIn) {
            //     alert(
            //         'Vous êtes déjà connecté. Redirection vers le tableau de bord.'
            //     );
            // }
            navigate('/app');
        }
    }, [actionData, setUser, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Connectez-vous à votre compte</CardTitle>
                    <CardDescription>
                        Veuillez entrer vos informations de connexion pour
                        accéder à votre compte.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Se connecter"
                        fields={[
                            { name: 'email', label: 'Email', type: 'email' },
                            {
                                name: 'password',
                                label: 'Mot de passe',
                                type: 'password',
                            },
                        ]}
                        isSubmitting={navigation.state === 'submitting'}
                        error={actionData?.error}
                        fieldErrors={actionData?.errors}
                    />
                </CardContent>
                <CardFooter>
                    <p className="text-gray-600 text-xs">
                        Vous n'avez pas de compte ?{' '}
                        <Link to="/sign-up">Inscrivez-vous ici</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
