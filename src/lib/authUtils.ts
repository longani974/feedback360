// src/utils/authUtils.ts
import {
    ActionFunctionArgs,
    defer,
    json,
    LoaderFunctionArgs,
    Params,
    redirect,
} from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    User,
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
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';

async function handleAuthAction(
    actionType: 'signIn' | 'signUp',
    email: string,
    password: string
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

    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    return await handleAuthAction('signUp', email, password);
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
                localStorage.clear();
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

export async function getOrganisation({ params }: { params: Params<string> }) {
    const { organisationId } = params;
    if (!organisationId) {
        throw new Error("L'ID de l'organisation est manquant.");
    }
    const docRef = doc(db, 'organisations', organisationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        console.log('Doc ID: ', docSnap.id);
        return { ...docSnap.data(), id: docSnap.id };
    } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
        return null;
    }
}

export async function addUserToOrganisation({
    params,
    request,
}: {
    params: Params<string>;
    request: Request;
}) {
    const formData = await request.formData();
    const newUserEmail = formData.get('email') as string;

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error('User is not authenticated.');
        return;
    }

    try {
        // Récupérer l'ID de l'utilisateur à partir de l'adresse email
        const userQuery = query(
            collection(db, 'users'),
            where('email', '==', newUserEmail)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.error(`No user found with email: ${newUserEmail}`);
            return;
        }

        const newUserId = userSnapshot.docs[0].id;
        console.log(newUserId);

        // Vérifier si la relation existe déjà
        const relationQuery = query(
            collection(db, 'userOrganisationRelation'),
            where('userId', '==', newUserId),
            where('organisationId', '==', params.organisationId)
        );
        const relationSnapshot = await getDocs(relationQuery);

        if (!relationSnapshot.empty) {
            return json(
                {
                    error: 'Cette personne est déjà inscrite',
                    name: 'RelationExistsError',
                },
                { status: 400 }
            );
        }

        // Ajouter le document dans la collection userOrganisationRelation

        console.log(`${newUserId}_${params.organisationId}`);
        await setDoc(
            doc(
                db,
                'userOrganisationRelation',
                `${newUserId}_${params.organisationId}`
            ), // Spécifie l'ID du document
            {
                userId: newUserId,
                organisationId: params.organisationId,
                isAdmin: false, // Vous pouvez rendre ceci dynamique selon les besoins
                createdAt: serverTimestamp(),
            }
        );

        console.log('User successfully added to organisation:');
        return redirect(`/app/organisations/${params.organisationId}`);
    } catch (error) {
        console.error('Error calling function:', error);
    }
}

// Lorsque l'on clique sur créer un nouveau questionnaire,
// On envoie le nom du questionnaire

// Schéma pour la collection Questionnaires
// export const questionnaireSchema = z.object({
//     organisationId: z.string(),
//     titre: z.string(),
//     dateCréation: z.date(), // ou z.string() si vous préférez travailler avec des chaines de charactères
// });

// export type Questionnaire = z.infer<typeof questionnaireSchema>;

export async function createFeedback({
    request,
}: {
    request: { formData: () => Promise<FormData> };
}) {
    const formData = await request.formData();
    const titre = formData.get('titre') as string;
    const organisationId = formData.get('organisationId') as string;
    const startDateStr = formData.get('startDate') as string; // Ajout du champ date de début
    const endDateStr = formData.get('endDate') as string;

    // Convertir les chaînes de date en objets Date
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    // Vérifier la validité des dates
    if (startDate && isNaN(startDate.getTime())) {
        return { status: 400, error: 'Date de début invalide' };
    }
    if (endDate && isNaN(endDate.getTime())) {
        return { status: 400, error: 'Date de fin invalide' };
    }

    try {
        // Créer un document dans la collection feedbacks
        const feedbackRef = await addDoc(collection(db, 'feedbacks'), {
            organisationId,
            titre,
            startDate, // Ajouter la date de début
            endDate,
            createdAt: serverTimestamp(),
        });

        console.log(feedbackRef.id);
        return redirect(`/app/feedbacks/add-question/${feedbackRef.id}`);
    } catch (error) {
        console.log(error);
        return { status: 400, error: 'Erreur lors de la création du feedback' };
    }
}

// Schéma pour la collection Questions
// export const questionSchema = z.object({
//     questionnaireId: z.string(),
//     texteQuestion: z.string(),
//     typeQuestion: z.enum(['choix multiples', 'réponse libre']),
//     options: z.array(z.string()).optional(),
// });

// export type Question = z.infer<typeof questionSchema>;
export async function createQuestion({
    params,
    request,
}: {
    params: Params<string>;
    request: Request;
}) {
    const feedbackId = params.campaignId;
    const formData = await request.formData();
    const question = formData.get('question') as string;

    if (!feedbackId) {
        throw new Error("L'ID du feedback est manquant.");
    }

    try {
        const questionRef = await addDoc(
            collection(db, 'feedbacks', feedbackId, 'questions'),
            {
                question,
                createdAt: serverTimestamp(),
            }
        );
        console.log(questionRef.id);
        return redirect(`/app/feedbacks/view/${feedbackId}`);
    } catch (error) {
        console.log(error);
        return { status: 400 };
    }

    return null; // return {status: 200} ou { status: 400 }
}

export async function getAllFeedbacks() {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error("Vous n'êtes pas connectez.");
        }
        // Récupérer l'ID de l'organisation depuis le Local Storage
        const organisationId = localStorage.getItem(
            `${userId}_selectedOrganisationId`
        );

        // Vérifiez si un ID d'organisation a été trouvé
        if (!organisationId) {
            throw new Error(
                'Aucune organisation sélectionnée. Veuillez sélectionner une organisation.'
            );
        }

        // Créer une requête pour récupérer les feedbacks de l'organisation sélectionnée
        const feedbackQuery = query(
            collection(db, 'feedbacks'),
            where('organisationId', '==', organisationId)
        );
        console.log(organisationId);
        const feedbacksSnapshot = await getDocs(feedbackQuery);
        const feedbacks = feedbacksSnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, id: doc.id };
        });

        return defer({ feedbacks });
    } catch (error) {
        console.error('Erreur lors de la récupération des feedbacks:', error);
        return { status: 400 };
    }
}

interface ResponseMap {
    [key: string]: {
        id: string;
        [key: string]: unknown;
    } | null;
}
export async function getFeedbackDetails({
    params,
}: {
    params: { feedbackId: string };
}) {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            throw new Error("Vous n'êtes pas connecté.");
        }

        // Récupérer l'ID de l'organisation depuis le Local Storage
        const organisationId = localStorage.getItem(
            `${userId}_selectedOrganisationId`
        );

        // Vérifiez si un ID d'organisation a été trouvé
        if (!organisationId) {
            throw new Error(
                'Aucune organisation sélectionnée. Veuillez sélectionner une organisation.'
            );
        }

        const { feedbackId } = params;
        if (!feedbackId) {
            throw new Error('ID du feedback non trouvé.');
        }

        // Récupérer les détails du feedback
        const feedbackDoc = await getDoc(doc(db, 'feedbacks', feedbackId));
        if (!feedbackDoc.exists()) {
            throw new Error('Feedback non trouvé.');
        }
        const feedbackData = feedbackDoc.data();

        // Récupérer les questions liées à ce feedback
        const questionsQuery = query(
            collection(db, 'questions'),
            where('feedbackId', '==', feedbackId)
        );
        const questionsSnapshot = await getDocs(questionsQuery);
        const questions = questionsSnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
        });

        // Récupérer les réponses liées aux questions
        const responsesMap: ResponseMap = {};
        for (const question of questions) {
            const responseQuery = query(
                collection(db, 'responses'),
                where('questionId', '==', question.id)
            );
            const responseSnapshot = await getDocs(responseQuery);
            if (!responseSnapshot.empty) {
                const responseData = responseSnapshot.docs[0].data();
                responsesMap[question.id] = {
                    ...responseData,
                    id: responseSnapshot.docs[0].id,
                };
            } else {
                responsesMap[question.id] = null;
            }
        }

        // Retourner les données via un objet defer
        return defer({
            feedback: feedbackData,
            questions,
            responsesMap,
        });
    } catch (error) {
        console.error(
            'Erreur lors de la récupération des détails du feedback:',
            error
        );
        return { status: 400 };
    }
}

// export async function getAllQuestions({ params }) {
//     const { campaignId } = params; // feedbackId est passé via les paramètres de route
//     console.log(campaignId);
//     try {
//         const questionsRef = collection(
//             db,
//             'feedbacks',
//             campaignId,
//             'questions'
//         );
//         const questionsSnapshot = await getDocs(questionsRef);
//         const questions = questionsSnapshot.docs.map((doc) => {
//             return { ...doc.data(), id: doc.id };
//         });

//         return defer({ questions });
//     } catch (error) {
//         console.error('Erreur lors du chargement des questions:', error);
//         return {
//             status: 400,
//             error: 'Erreur lors du chargement des questions',
//         };
//     }
// }

function waitForAuth(): Promise<User | null> {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe(); // Ne pas oublier de se désabonner
            resolve(user);
        }, reject);
    });
}

// export async function getAllQuestions({ params }) {
//     const { campaignId } = params;
//     // Attendre que l'utilisateur soit défini
//     const user = await waitForAuth();

//     if (!user) {
//         return {
//             redirect: '/login',
//             error: 'Utilisateur non authentifié',
//         };
//     }

//     const userId = user.uid;

//     console.log(campaignId);
//     try {
//         // Récupération des questions
//         const questionsRef = collection(
//             db,
//             'feedbacks',
//             campaignId,
//             'questions'
//         );
//         const questionsSnapshot = await getDocs(questionsRef);
//         const questions = questionsSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//         }));

//         // Récupération des réponses pour chaque question
//         const responsesMap = {};
//         for (const question of questions) {
//             // Récupérer la réponse spécifique de l'utilisateur pour cette question
//             const responseDocRef = doc(
//                 db,
//                 'responses',
//                 `${userId}_${question.id}`
//             );
//             const responseDoc = await getDoc(responseDocRef);

//             if (responseDoc.exists()) {
//                 responsesMap[question.id] = {
//                     id: responseDoc.id,
//                     ...responseDoc.data(),
//                 };
//             } else {
//                 responsesMap[question.id] = null; // Pas de réponse de cet utilisateur
//             }
//         }

//         return { questions, responsesMap };
//     } catch (error) {
//         console.error('Erreur lors du chargement des questions:', error);
//         return {
//             status: 400,
//             error: 'Erreur lors du chargement des questions',
//         };
//     }
// }
export async function getAllQuestions({ params }: { params: Params<string> }) {
    const { campaignId } = params;
    if (!campaignId) {
        throw new Error("L'ID de la campagne est manquant.");
    } // Attendre que l'utilisateur soit défini
    const user = await waitForAuth();

    if (!user) {
        return {
            redirect: '/login',
            error: 'Utilisateur non authentifié',
        };
    }

    const userId = user.uid;

    try {
        // Récupération des informations du feedback
        const feedbackDocRef = doc(db, 'feedbacks', campaignId);
        const feedbackDoc = await getDoc(feedbackDocRef);
        if (!feedbackDoc.exists()) {
            throw new Error('Feedback non trouvé');
        }
        const feedbackData = feedbackDoc.data();
        const { titre, endDate, startDate } = feedbackData;

        // Récupération des questions
        const questionsRef = collection(
            db,
            'feedbacks',
            campaignId,
            'questions'
        );
        const questionsSnapshot = await getDocs(questionsRef);
        const questions = questionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Récupération des réponses pour chaque question
        const responsesMap: ResponseMap = {};
        for (const question of questions) {
            const responseDocRef = doc(
                db,
                'responses',
                `${userId}_${question.id}`
            );
            const responseDoc = await getDoc(responseDocRef);

            if (responseDoc.exists()) {
                responsesMap[question.id] = {
                    id: responseDoc.id,
                    ...responseDoc.data(),
                };
            } else {
                responsesMap[question.id] = null; // Pas de réponse de cet utilisateur
            }
        }

        return { questions, responsesMap, titre, endDate, startDate };
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        return {
            status: 400,
            error: 'Erreur lors du chargement des questions',
        };
    }
}

export function formatDate(date: string | Timestamp): string {
    if (typeof date === 'object' && 'toDate' in date) {
        // Si c'est un objet Timestamp, on le convertit en Date
        return date.toDate().toLocaleDateString();
    }
    // Sinon, on suppose que c'est un string (formaté en ISO) et on le convertit
    return new Date(date).toLocaleDateString();
}

export async function getQuestionById({ params }: { params: Params<string> }) {
    const { campaignId, questionId } = params;

    if (!campaignId || !questionId) {
        throw new Error("L'ID de la campagne ou de la question est manquant.");
    }

    try {
        const questionRef = doc(
            db,
            'feedbacks',
            campaignId,
            'questions',
            questionId
        );
        const questionSnapshot = await getDoc(questionRef);

        if (questionSnapshot.exists()) {
            return { question: questionSnapshot.data().question };
        } else {
            throw new Error('Question non trouvée');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
        return { question: '' };
    }
}

export async function updateQuestion({
    params,
    request,
}: {
    params: Params<string>;
    request: Request;
}) {
    const { campaignId, questionId } = params;

    if (!campaignId || !questionId) {
        throw new Error("L'ID de la campagne ou de la question est manquant.");
    }

    const formData = await request.formData();
    const updatedQuestion = formData.get('question') as string;

    try {
        const questionRef = doc(
            db,
            'feedbacks',
            campaignId,
            'questions',
            questionId
        );
        await updateDoc(questionRef, {
            question: updatedQuestion,
            updatedAt: serverTimestamp(),
        });

        return redirect(`/app/feedbacks/view/${campaignId}`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la question:', error);
        return { status: 400 };
    }
}

export async function deleteQuestion({
    params,
    request,
}: {
    params: Params<string>;
    request: Request;
}) {
    const { campaignId } = params;
    const formData = await request.formData();
    const questionId = formData.get('questionId');

    // Ensure questionId is a string
    if (typeof questionId !== 'string' || !campaignId || !questionId) {
        return { status: 400, message: 'Invalid request' };
    }

    try {
        await deleteDoc(
            doc(db, 'feedbacks', campaignId, 'questions', questionId)
        );
        // Redirection pour forcer le rechargement des données via loader
        return redirect(`/app/feedbacks/view/${campaignId}`);
    } catch (error) {
        console.error('Erreur lors de la suppression de la question:', error);
        return { status: 500, message: 'Erreur serveur' };
    }
}

// Fonction pour ajouter ou mettre à jour une réponse
export async function addOrUpdateResponse({
    params,
    request,
}: {
    params: Params<string>;
    request: Request;
}) {
    const { campaignId, questionId } = params; // ID de la campagne et de la question, fournis via les paramètres de la route
    const formData = await request.formData();
    const responseText = formData.get('responseText') as string; // Réponse saisie par l'utilisateur

    // Authentifier l'utilisateur
    const user = await waitForAuth();

    if (!user) {
        return {
            redirect: '/login',
            error: 'Utilisateur non authentifié',
        };
    }

    const userId = user.uid;

    // Référence au document de réponse
    const responseDocRef = doc(db, 'responses', `${userId}_${questionId}`);

    // Structure des données de réponse
    const responseData = {
        campaignId,
        questionId,
        userId,
        responseText,
        updatedAt: serverTimestamp(), // Ajoute un timestamp pour la mise à jour
    };

    try {
        // Ajout ou mise à jour du document de réponse
        await setDoc(responseDocRef, responseData, { merge: true });

        // Redirection après ajout ou mise à jour de la réponse
        return redirect(`/app/feedbacks/view/${campaignId}`);
    } catch (error) {
        console.error(
            "Erreur lors de l'ajout ou de la mise à jour de la réponse:",
            error
        );
        return {
            status: 500,
            message:
                "Erreur lors de l'ajout ou de la mise à jour de la réponse",
        };
    }
}

export const compiledResponsesLoader = async ({
    params,
}: LoaderFunctionArgs) => {
    const campaignId = params.campaignId;

    if (!campaignId) {
        throw new Response('ID de la campagne non trouvé.', { status: 400 });
    }

    try {
        const compileResponses = httpsCallable(functions, 'compileResponses');
        const result = await compileResponses({ feedbackId: campaignId });
        console.log(result.data);
        return result.data;
    } catch (err) {
        console.error(
            'Erreur lors de la récupération des réponses compilées:',
            err
        );
        throw new Response(
            'Erreur lors de la récupération des réponses compilées.',
            { status: 500 }
        );
    }
};
