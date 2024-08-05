/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});

admin.initializeApp();
const db = admin.firestore();

// Fonction déclenchée à chaque création d'un utilisateur
export const createUserDocument = functions.auth
    .user()
    .onCreate(async (user) => {
        const userId = user.uid;
        const userEmail = user.email;

        const userDoc = {
            email: userEmail,
            createdAt: FieldValue.serverTimestamp(),
            // Ajoutez d'autres champs nécessaires ici
        };

        // Crée un document dans la collection 'users' avec l'ID de l'utilisateur
        await db.collection('users').doc(userId).set(userDoc);
    });
