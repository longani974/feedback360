import { ActionFunctionArgs } from 'react-router-dom';
import { loginSchema, signupSchema } from './schemas';
import { createAccount, signInAccount } from './appWrite/api';
import { account } from './appWrite/config';
import { Models } from 'appwrite';

/**
 * Vérifie si l'utilisateur est déjà connecté et gère les sessions si nécessaire.
 * Retourne l'utilisateur courant s'il est déjà connecté.
 */
async function checkCurrentSession(email: string): Promise<{
    success: boolean;
    user?: Models.User<Models.Preferences>;
    alreadyLoggedIn?: boolean;
}> {
    try {
        const currentUser = await account.get();
        if (currentUser && currentUser.email !== email) {
            await account.deleteSessions(); // Déconnecte l'utilisateur actuel s'il est différent
        }
        return {
            success: true,
            user: currentUser,
            alreadyLoggedIn: true,
        };
    } catch {
        return { success: false };
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

    try {
        await checkCurrentSession(email);
        await signInAccount({ email, password });
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        console.error(error);
        return {
            error: 'Échec de la connexion. Veuillez vérifier vos identifiants.',
        };
    }
}

export async function signupAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string; // Ajout d'un champ pour le nom

    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    try {
        await checkCurrentSession(email);
        await createAccount({ email, password, name });
        await signInAccount({ email, password });
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        console.error(error);
        return {
            error: "Échec de l'inscription. Veuillez vérifier vos informations.",
        };
    }
}
