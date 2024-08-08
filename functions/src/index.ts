import { onCall, HttpsError } from 'firebase-functions/v2/https';
// import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
// import { onDocumentCreatedWithAuthContext } from 'firebase-functions/v2/firestore';

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
// const db = admin.firestore();

// Fonction déclenchée à chaque création d'un utilisateur
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

export const createOrganisation = onCall<
    CreateOrganisationParams,
    CreateOrganisationResult
>(
    {
        // Ajoutez ici les options de la fonction si nécessaire
    },
    (request): CreateOrganisationResult => {
        // Vérifiez l'authentification
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Authentication required!');
        }

        const { organisationName } = request.data;
        const userId = request.auth.uid;

        if (!organisationName) {
            throw new HttpsError('invalid-argument', 'Invalid input data!');
        }

        // Créez un document pour l'organisation
        const organisationRef = admin
            .firestore()
            .collection('organisations')
            .doc();
        const userOrganisationRef = admin
            .firestore()
            .collection('userOrganisationRelation')
            .doc();

        // Effectuez les opérations de manière asynchrone, mais retournez immédiatement
        Promise.all([
            organisationRef.set({
                name: organisationName,
                createdAt: FieldValue.serverTimestamp(),
            }),
            userOrganisationRef.set({
                userId: userId,
                organisationId: organisationRef.id,
                createdAt: FieldValue.serverTimestamp(),
            }),
        ]).catch((error) => {
            logger.error('Error creating organisation:', error);
            // Notez que nous ne pouvons pas lancer d'erreur ici car la fonction a déjà retourné
        });

        // Retournez immédiatement le résultat
        return { success: true, organisationId: organisationRef.id };
    }
);
