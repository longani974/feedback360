// src/utils/authUtils.ts
import { ActionFunctionArgs, defer } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/firebase';
import { loginSchema, signupSchema } from './schemas';
import {
    Organisation,
    organisationSchema,
    UserOrganisationRelation,
    userOrganisationRelationSchema,
} from '@/schemas/firestoreSchela';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
    CreateOrganisationParams,
    CreateOrganisationResult,
} from '../../functions/src/index';
import { collection, getDocs, query, where } from 'firebase/firestore';

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

    const result = organisationSchema.safeParse({ name: name });
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

// get userOrganisationRelation that match userId from firestore
export async function fetchUserOrganisationRelations(): Promise<
    UserOrganisationRelation[]
> {
    const auth = getAuth();

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;
                const userOrgQuery = query(
                    collection(db, 'userOrganisationRelation'),
                    where('userId', '==', userId)
                );

                try {
                    const userOrgSnapshot = await getDocs(userOrgQuery);
                    const relations = userOrgSnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return userOrganisationRelationSchema.parse(data);
                    });
                    resolve(relations);
                } catch (error) {
                    console.error(
                        'Error fetching user organisation relations:',
                        error
                    );
                    reject(
                        new Error(
                            'Failed to fetch user organisation relations.'
                        )
                    );
                }
            } else {
                reject(new Error('User is not authenticated.'));
            }
        });
    });
}
// get organisations that match organisationId from get userOrganisationRelation
export async function fetchOrganisationsByIds(
    organisationIds: string[]
): Promise<Organisation[]> {
    if (organisationIds.length === 0) {
        return [];
    }

    const orgQuery = query(
        collection(db, 'organisations'),
        where('__name__', 'in', organisationIds)
    );

    try {
        const orgSnapshot = await getDocs(orgQuery);
        return orgSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...organisationSchema.parse(doc.data()),
        }));
    } catch (error) {
        console.error('Error fetching organisations:', error);
        throw new Error('Failed to fetch organisations.');
    }
}
// fusion data userOrganisationRelation and organisations then return data
export async function getUserOrganisations() {
    try {
        // Étape 1: Récupérer les relations utilisateur-organisation
        const userOrgRelations = await fetchUserOrganisationRelations();
        // Étape 2: Récupérer les détails des organisations basées sur les Ids
        const organisationIds = userOrgRelations.map(
            (rel) => rel.organisationId
        );
        const organisations = await fetchOrganisationsByIds(organisationIds);
        // Étape 3: Fusionner les données
        const organisationMap = new Map<string, Organisation>();
        organisations.forEach((org) => {
            organisationMap.set(org.id, org);
        });

        const userOrganisations = userOrgRelations.map((rel) => ({
            ...organisationMap.get(rel.organisationId),
            isAdmin: rel.isAdmin,
        }));

        return defer({ userOrganisations: userOrganisations });
    } catch (error) {
        console.error('Error getting user organisations:', error);
        throw error; // Relancer l'erreur pour une gestion ultérieure
    }
}
