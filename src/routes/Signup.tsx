// src/routes/Signup.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AuthForm } from '../components/AuthForm';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import { useActionData } from 'react-router-dom';
import { User } from 'firebase/auth';

type ActionData = {
    success?: boolean;
    user?: User;
    error?: string;
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
};

export default function SignUp() {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();
    const navigate = useNavigate();

    useEffect(() => {
        if (actionData?.success && actionData.user) {
            navigate('/app');
        }
    }, [actionData, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Créez votre compte</CardTitle>
                    <CardDescription>
                        Veuillez entrer vos informations pour créer un compte.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="S'inscrire"
                        fields={[
                            { name: 'name', label: 'Nom', type: 'text' },
                            { name: 'email', label: 'Email', type: 'email' },
                            {
                                name: 'password',
                                label: 'Mot de passe',
                                type: 'password',
                            },
                            {
                                name: 'confirmPassword',
                                label: 'Confirmez le mot de passe',
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
                        Vous avez déjà un compte ?{' '}
                        <Link to="/sign-in">Connectez-vous ici</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
