import {
    onCall,
    HttpsError,
    CallableRequest,
} from 'firebase-functions/v2/https';
// import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
// import { onDocumentCreatedWithAuthContext } from 'firebase-functions/v2/firestore';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Interface pour les données entrantes de la fonction createOrganisation
export interface CreateOrganisationParams {
    organisationName: string;
}

// Interface pour les données sortantes de la fonction createOrganisation
export interface CreateOrganisationResult {
    success: boolean;
    organisationId?: string;
    error?: string;
}

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = beforeUserCreated(async (event) => {
    const user = event.data;
    const userId = user.uid;
    const userEmail = user.email;

    const userDoc = {
        email: userEmail,
        createdAt: FieldValue.serverTimestamp(),
        // Ajoutez d'autres champs nécessaires ici
    };

    // Crée un document dans la collection 'users' avec l'ID de l'utilisateur
    await admin.firestore().collection('users').doc(userId).set(userDoc);

    return;
});

// On ne peut pas utiliser cette function avec l'emulator car:
// const { authId } = event; authId renvoi un fake identifiant du genr test@gmail.com
// Du coup on utilise la function createOrganisation avec un appel https pour avoir UID dans l'emulator
//
// Fonction déclenchée à chaque création d'un utilisateur
// exports.createUserOrganisationRelation = onDocumentCreatedWithAuthContext(
//     'organisations/{organisationId}',
//     async (event) => {
//         const snapshot = event.data;
//         if (!snapshot) {
//             console.log('No data associated with the event');
//             return;
//         }

//         const { authId } = event;
//         console.log(authId);
//         if (!authId) {
//             console.error('User ID is not available in the auth context.');
//             return;
//         }

//         const organisationId = event.params.organisationId;
//         const userOrganisationRelationDoc = {
//             organisationId: organisationId,
//             userId: authId,
//             createdAt: FieldValue.serverTimestamp(),
//             // Ajoutez d'autres champs nécessaires ici
//         };

//         await db
//             .collection('userOrganisationRelation')
//             .doc(organisationId)
//             .set(userOrganisationRelationDoc);
//     }
// );

export const createOrganisation = onCall(
    async (request): Promise<CreateOrganisationResult> => {
        // Vérifiez l'authentification
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required!');
        }

        const { organisationName } = request.data;
        const userId = request.auth.uid;

        if (!organisationName) {
            throw new HttpsError('invalid-argument', 'Invalid input data!');
        }

        try {
            // Créez un document pour l'organisation
            const organisationRef = admin
                .firestore()
                .collection('organisations')
                .doc();
            await organisationRef.set({
                name: organisationName,
                createdAt: FieldValue.serverTimestamp(),
                createBy: userId,
            });

            // Créez un document pour la relation utilisateur-organisation
            const userOrganisationRef = admin
                .firestore()
                .collection('userOrganisationRelation')
                .doc(`${userId}_${organisationRef.id}`);
            await userOrganisationRef.set({
                userId: userId,
                organisationId: organisationRef.id,
                isAdmin: true,
                createdAt: FieldValue.serverTimestamp(),
            });

            // Créez une transaction de crédits dans la sous-collection 'credits'
            const creditsRef = organisationRef.collection('credits').doc(); // Génère automatiquement un ID pour chaque transaction de crédit
            await creditsRef.set({
                transactionType: 'initial', // Type de transaction "initial"
                creditsAdded: 100, // Attribution de 100 crédits
                createdAt: FieldValue.serverTimestamp(),
                createdBy: userId,
            });

            // Créez une transaction de crédits dans la sous-collection 'credits'
            const currentCreditsRef = organisationRef
                .collection('credits')
                .doc('currentCredits');
            await currentCreditsRef.set({
                amount: 100, // Solde initial de crédits
                lastUpdated: FieldValue.serverTimestamp(),
            });

            // Retournez le résultat avec l'ID de l'organisation
            return { success: true, organisationId: organisationRef.id };
        } catch (error) {
            console.error('Error creating organisation:', error);
            throw new HttpsError('internal', 'Error creating organisation.');
        }
    }
);

type PurchaseCreditsResult = {
    success: boolean;
};

export const purchaseCredits = onCall(
    async (request): Promise<PurchaseCreditsResult> => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required!');
        }

        const { organisationId, creditsPurchased } = request.data;
        const userId = request.auth.uid;

        if (!request.auth || !organisationId || !creditsPurchased) {
            throw new HttpsError('invalid-argument', 'Invalid input data!');
        }

        try {
            // Vérifiez que l'utilisateur est admin de l'organisation
            const organisationRef = admin
                .firestore()
                .collection('organisations')
                .doc(organisationId);
            const organisationDoc = await organisationRef.get();
            if (!organisationDoc.exists || !organisationDoc.data()) {
                throw new HttpsError('not-found', 'Organization not found.');
            }
            // Vérifie que l'utilisateur qui fait la demande est bien le créateur de l'organisation
            if (organisationDoc.data()?.createBy !== userId) {
                throw new HttpsError(
                    'permission-denied',
                    'You do not have permission to modify credits for this organization.'
                );
            }

            // Ajoutez une nouvelle transaction de crédits dans la sous-collection 'credits'
            const creditsRef = organisationRef.collection('credits').doc(); // Nouveau document pour cette transaction
            await creditsRef.set({
                transactionType: 'purchase', // Type de transaction "purchase"
                creditsAdded: creditsPurchased, // Crédits achetés
                createdAt: FieldValue.serverTimestamp(),
                createdBy: userId,
            });

            // Récupérer le document currentCredits
            const currentCreditsRef = organisationRef
                .collection('credits')
                .doc('currentCredits');
            const currentCreditsDoc = await currentCreditsRef.get();

            // S'il n'existe pas encore, l'initialiser avec 0
            let currentAmount = currentCreditsDoc.exists
                ? currentCreditsDoc.data()?.amount
                : 0;

            // Mettre à jour le solde avec les crédits achetés
            currentAmount += creditsPurchased;
            await creditsRef.update({
                amount: currentAmount,
                lastUpdated: FieldValue.serverTimestamp(),
            });

            return { success: true };
        } catch (error) {
            console.error('Error purchasing credits:', error);
            throw new HttpsError('internal', 'Error purchasing credits.');
        }
    }
);

export const createFeedbackWithCredits = onCall(
    async (
        request: CallableRequest
    ): Promise<{ success: boolean; feedbackId?: string; error?: string }> => {
        if (!request.auth) {
            return { success: false, error: 'Authentication required!' };
        }

        const { organisationId, titre, startDate, endDate } = request.data;
        const userId = request.auth.uid;
        const creditsNeeded = 10;

        if (!organisationId || !titre) {
            return { success: false, error: 'Invalid input data!' };
        }

        try {
            const result = await admin.firestore().runTransaction(
                async (transaction: {
                    get: (arg0: any) => any;
                    update: (arg0: any, arg1: { amount: number }) => void;
                    set: (
                        arg0: any,
                        arg1: {
                            organisationId: any;
                            titre: any;
                            startDate: any;
                            endDate: any;
                            createdAt: admin.firestore.FieldValue;
                        }
                    ) => void;
                }) => {
                    // Récupérer l'organisation
                    const organisationRef = admin
                        .firestore()
                        .collection('organisations')
                        .doc(organisationId);
                    const organisationDoc =
                        await transaction.get(organisationRef);

                    if (!organisationDoc.exists) {
                        throw new HttpsError(
                            'not-found',
                            'Organization not found.'
                        );
                    }

                    // Vérifier que l'utilisateur est autorisé à créer un feedback
                    if (organisationDoc.data()?.createBy !== userId) {
                        throw new HttpsError(
                            'permission-denied',
                            'You do not have permission to create feedbacks for this organization.'
                        );
                    }

                    // Vérifier et déduire les crédits
                    const creditsRef = organisationRef
                        .collection('credits')
                        .doc('currentCredits');
                    const creditsDoc = await transaction.get(creditsRef);

                    if (
                        !creditsDoc.exists ||
                        creditsDoc.data()?.amount < creditsNeeded
                    ) {
                        throw new HttpsError(
                            'failed-precondition',
                            'Not enough credits to create feedback.'
                        );
                    }

                    // Déduire les crédits
                    const newCreditAmount =
                        creditsDoc.data()!.amount - creditsNeeded;
                    transaction.update(creditsRef, {
                        amount: newCreditAmount,
                    });

                    // Créer le feedback
                    const feedbackRef = admin
                        .firestore()
                        .collection('feedbacks')
                        .doc();

                    transaction.set(feedbackRef, {
                        organisationId,
                        titre,
                        startDate,
                        endDate,
                        createdAt: FieldValue.serverTimestamp(),
                    });

                    return feedbackRef.id;
                }
            );

            return { success: true, feedbackId: result };
        } catch (error) {
            console.error('Error during feedback creation:', error);

            // Gestion sécurisée de l'erreur
            const errorMessage =
                (error as Error).message || 'Internal server error';
            return { success: false, error: errorMessage };
        }
    }
);

// export const compileResponses = onCall(
//     async (request: CallableRequest): Promise<{ compiledResponses: any[] }> => {
//         // Vérification de l'authentification de l'utilisateur
//         if (!request.auth) {
//             throw new HttpsError('unauthenticated', 'Authentication required!');
//         }

//         const feedbackId = request.data.feedbackId;

//         if (!feedbackId) {
//             throw new HttpsError(
//                 'invalid-argument',
//                 'Feedback ID is required!'
//             );
//         }

//         try {
//             // Récupérer toutes les réponses pour le feedback spécifique
//             const responsesSnapshot = await db
//                 .collection('responses')
//                 .where('campaignId', '==', feedbackId)
//                 .get();

//             const compiledResponses: any[] = [];

//             responsesSnapshot.forEach((doc) => {
//                 const response = doc.data();
//                 // Masquer l'ID utilisateur pour l'anonymat
//                 delete response.userId;
//                 compiledResponses.push(response);
//             });

//             return { compiledResponses };
//         } catch (error) {
//             console.error('Error compiling responses:', error);
//             throw new HttpsError('internal', 'Error compiling responses.');
//         }
//     }
// );

export const compileResponses = onCall(
    async (request: CallableRequest): Promise<{ questions: any[] }> => {
        // Vérification de l'authentification de l'utilisateur
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required!');
        }

        const feedbackId = request.data.feedbackId;

        if (!feedbackId) {
            throw new HttpsError(
                'invalid-argument',
                'Feedback ID is required!'
            );
        }

        try {
            // Récupérer toutes les questions pour le feedback spécifique
            const questionsSnapshot = await db
                .collection('feedbacks')
                .doc(feedbackId)
                .collection('questions')
                .get();

            // Créer un objet pour lier les IDs de questions aux textes des questions
            const questionsMap: Record<string, string> = {};
            questionsSnapshot.forEach(
                (doc: { data: () => any; id: string | number }) => {
                    const questionData = doc.data();
                    // Assurez-vous que 'question' est le bon champ dans vos documents de questions
                    if (questionData.question) {
                        questionsMap[doc.id] = questionData.question;
                    } else {
                        console.warn(
                            `Question text not found for question ID: ${doc.id}`
                        );
                    }
                }
            );

            // Récupérer toutes les réponses pour le feedback spécifique
            const responsesSnapshot = await db
                .collection('responses')
                .where('campaignId', '==', feedbackId)
                .get();

            // Regrouper les réponses par question
            const questionsWithResponses: Record<
                string,
                { questionText: string; responses: any[] }
            > = {};

            responsesSnapshot.forEach((doc: { data: () => any }) => {
                const response = doc.data();
                const questionId = response.questionId;
                const questionText =
                    questionsMap[questionId] || 'Question inconnue'; // Valeur par défaut si l'ID de question n'est pas trouvé

                // Assurez-vous que le texte de la question et les réponses sont correctement stockés
                if (!questionsWithResponses[questionId]) {
                    questionsWithResponses[questionId] = {
                        questionText,
                        responses: [],
                    };
                }
                // Ajouter la réponse à la question correspondante
                questionsWithResponses[questionId].responses.push({
                    responseText: response.responseText,
                    updatedAt: response.updatedAt,
                });

                // Masquer l'ID utilisateur pour l'anonymat
                delete response.userId;
            });

            // Convertir les objets en tableau pour la réponse
            const questionsArray = Object.values(questionsWithResponses);

            return { questions: questionsArray };
        } catch (error) {
            console.error('Error compiling responses:', error);
            throw new HttpsError('internal', 'Error compiling responses.');
        }
    }
);

export const handleStripeWebhook = functions.https.onRequest(
    async (req, res) => {
        const stripe = new Stripe(functions.config().stripe.secret);
        const endpointSecret = functions.config().stripe.webhook_secret;
        const sig = req.headers['stripe-signature'] as string;
        let event: Stripe.Event;
        console.log('handleStripeWebhook processing');
        try {
            // Construct the Stripe event from the raw request body and signature
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                sig,
                endpointSecret
            );
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Webhook Error: ${err.message}`);
                res.status(400).send(`Webhook Error: ${err.message}`);
            } else {
                console.error('Webhook Error: Unknown error');
                res.status(400).send('Webhook Error: Unknown error');
            }
            return; // Assurez-vous de retourner après avoir envoyé la réponse
        }
        if (event.type === 'payment_intent.succeeded') {
            // on n'utilise pas checkout.session.completed car avec l'exenttion stripe dans firebase les metadata ne passent pas. Par contre on les reçoit bien avec payment_intent.succeeded
            const session = event.data.object;
            // Log the session for debugging
            console.log('payment_intent succeeded:', session);
            try {
                // Extraire l'identifiant de l'organisation des metadata de la session
                // const organisationId = session.metadata?.organisationId;
                const { organisationId, userId } = session.metadata;
                if (!organisationId) {
                    throw new Error(
                        'organisationId is missing in session metadata'
                    );
                }

                // Chemin dynamique vers le document currentCredits
                const currentCreditsDocRef = admin
                    .firestore()
                    .doc(
                        `/organisations/${organisationId}/credits/currentCredits`
                    );
                // Chemin dynamique vers la collection credits
                const creditscRef = admin
                    .firestore()
                    .collection(`/organisations/${organisationId}/credits`);

                // Mise à jour du document currentCredits en ajoutant 100 crédits
                await admin.firestore().runTransaction(async (transaction) => {
                    const creditsDoc =
                        await transaction.get(currentCreditsDocRef);
                    if (!creditsDoc.exists) {
                        throw new Error(
                            "Le document currentCredits n'existe pas."
                        );
                    }

                    const currentCredits = creditsDoc.data()?.amount || 0;
                    const newCredits = currentCredits + 100;

                    transaction.update(currentCreditsDocRef, {
                        amount: newCredits,
                        lastUpdated: FieldValue.serverTimestamp(),
                    });
                });
                await admin.firestore().collection('payments').add({
                    sessionId: session.id,
                    organisationId: organisationId, // Stocker l'identifiant de l'organisation avec le paiement
                    userId: userId,
                    amount: session.amount_received,
                    currency: session.currency,
                    customer: session.customer,
                    status: session.status,
                    created: session.created,
                    method: session.payment_method,
                    added: FieldValue.serverTimestamp(),
                });
                await creditscRef.add({
                    organisationId: organisationId, // Stocker l'identifiant de l'organisation avec le paiement
                    userId: userId,
                    creditsAdded: session.amount_received / 10,
                    createAt: FieldValue.serverTimestamp(),
                    transactionType: 'payement',
                });

                console.log(
                    `100 crédits ajoutés avec succès pour l'organisation ${organisationId}.`
                );

                // Répondre à Stripe que l'événement a été traité
                res.status(200).json({ received: true });
            } catch (error) {
                console.error(
                    'Erreur lors de la mise à jour des crédits:',
                    error
                );
                res.status(500).send('Internal Server Error');
            }
        } else {
            // Respond to Stripe for unsupported event types
            res.status(400).send('Event type not supported');
        }
        // Handle the event based on its type
        // if (event.type === 'checkout.session.completed') {
        //     const session = event.data.object as Stripe.Checkout.Session;

        //     // Log the session for debugging
        //     console.log('Checkout Session completed:', session);

        //     try {
        //         // Extraire l'identifiant de l'organisation des metadata de la session
        //         // const organisationId = session.metadata?.organisationId;

        //         // Mise à jour des détails de paiement dans Firestore
        //         await admin.firestore().collection('payments').add({
        //             sessionId: session.id,
        //             // organisationId: organisationId, // Stocker l'identifiant de l'organisation avec le paiement
        //             amountTotal: session.amount_total,
        //             currency: session.currency,
        //             customer: session.customer,
        //             paymentStatus: session.payment_status,
        //             created: session.created,
        //         });

        //         // Répondre à Stripe que l'événement a été traité
        //         res.status(200).json({ received: true });
        //     } catch (error) {
        //         console.error(
        //             'Erreur lors de la mise à jour des crédits:',
        //             error
        //         );
        //         res.status(500).send('Internal Server Error');
        //     }
        // } else {
        //     // Respond to Stripe for unsupported event types
        //     res.status(400).send('Event type not supported');
        // }
    }
);
