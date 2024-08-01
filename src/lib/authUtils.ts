// src/utils/authUtils.ts
import { ActionFunctionArgs } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { loginSchema, signupSchema } from './schemas';

async function handleAuthAction(
    actionType: 'signIn' | 'signUp',
    email: string,
    password: string,
    name?: string
) {
    try {
        if (actionType === 'signIn') {
            await signInWithEmailAndPassword(auth, email, password);
        } else if (actionType === 'signUp') {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        // Optionnel: Récupérer l'utilisateur actuel après l'action
        const user = auth.currentUser;
        return { success: true, user };
    } catch (error) {
        console.error(error);
        return {
            error:
                actionType === 'signIn'
                    ? 'Échec de la connexion. Veuillez vérifier vos identifiants.'
                    : "Échec de l'inscription. Veuillez vérifier vos informations.",
        };
    }
}

export async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    return await handleAuthAction('signIn', email, password);
}

export async function signupAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;

    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    return await handleAuthAction('signUp', email, password, name);
}
