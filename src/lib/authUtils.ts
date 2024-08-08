// src/utils/authUtils.ts
import { ActionFunctionArgs } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAuth,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { loginSchema, signupSchema } from './schemas';
import { organisationSchema } from '@/schemas/firestoreSchela';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
    CreateOrganisationParams,
    CreateOrganisationResult,
} from '../../functions/src/index';

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
const functions = getFunctions();
const createOrganisation = httpsCallable<
    CreateOrganisationParams,
    CreateOrganisationResult
>(functions, 'createOrganisation');

async function createNewOrganisation(
    organisationName: CreateOrganisationParams
) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error('User is not authenticated.');
        return;
    }

    try {
        const result = await createOrganisation(organisationName);
        if (result.data.success) {
            console.log(
                'Organisation created with ID:',
                result.data.organisationId
            );
        } else {
            console.error('Error creating organisation:', result.data.error);
        }
    } catch (error) {
        console.error('Error calling function:', error);
    }
}

export async function addOrganisationAction({ request }: ActionFunctionArgs) {
    console.log('adding');

    const formData = await request.formData();
    const name = formData.get('name') as string;

    const result = organisationSchema.safeParse({ nomOrganisation: name });
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    try {
        const result = await createNewOrganisation({ organisationName: name });
        // const result = await addDoc(collection(db, 'organisations'), {
        //     name,
        // });
        console.log(result);
        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            error: 'Échec de lors de la création. Réessyez plus tard',
        };
    }
}
