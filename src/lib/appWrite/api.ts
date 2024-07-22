import { Models } from 'appwrite';
import { account } from './config';

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session: Models.Session =
            await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error) {
        alert('Un problème est survenue, réesseyez plus tard');
    }
}

export async function createAccount({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name: string;
}) {
    try {
        const response = await account.create(
            'unique()',
            email,
            password,
            name
        );
        return response;
    } catch (error) {
        console.error('Erreur lors de la création du compte:', error);
        throw error;
    }
}

export async function getLoggedInUser() {
    try {
        return await account.get();
    } catch (error) {
        return null;
    }
}
