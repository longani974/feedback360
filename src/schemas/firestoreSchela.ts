import { z } from 'zod';

// Schéma pour la collection Users
export const userSchema = z.object({
    nom: z.string(),
    prenom: z.string(),
    email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

// Schéma pour la collection Organisations
export const organisationSchema = z.object({
    name: z.string(),
});

export type Organisation = z.infer<typeof organisationSchema> & { id: string };

// Schéma pour la collection Questionnaires
export const questionnaireSchema = z.object({
    organisationId: z.string(),
    titre: z.string(),
    dateCréation: z.date(), // ou z.string() si vous préférez travailler avec des chaines de charactères
});

export type Questionnaire = z.infer<typeof questionnaireSchema>;

// Schéma pour la collection Questions
export const questionSchema = z.object({
    questionnaireId: z.string(),
    texteQuestion: z.string(),
    typeQuestion: z.enum(['choix multiples', 'réponse libre']),
    options: z.array(z.string()).optional(),
});

export type Question = z.infer<typeof questionSchema>;

// Schéma pour la collection Réponses
export const réponseSchema = z.object({
    userId: z.string(),
    questionId: z.string(),
    réponse: z.string(),
    questionnaireId: z.string(),
});

export type Réponse = z.infer<typeof réponseSchema>;

// Schéma pour la collection Users_Organisations
export const userOrganisationRelationSchema = z.object({
    userId: z.string(),
    organisationId: z.string(),
    isAdmin: z.boolean(),
});

export type UserOrganisationRelation = z.infer<
    typeof userOrganisationRelationSchema
>;

// Schéma pour la collection Participations
export const participationSchema = z.object({
    userId: z.string(),
    questionnaireId: z.string(),
    dateParticipation: z.string(), // ou z.date()
});

export type Participation = z.infer<typeof participationSchema>;

// Schéma pour la collection Équipes
export const équipeSchema = z.object({
    organisationId: z.string(),
    nomÉquipe: z.string(),
});

export type Équipe = z.infer<typeof équipeSchema>;

// Schéma pour la collection Team_Users
export const teamUserRelationSchema = z.object({
    teamId: z.string(),
    userId: z.string(),
    rôle: z.string(),
});

export type TeamUserRelation = z.infer<typeof teamUserRelationSchema>;

// Schéma pour la collection Admins_Organisations
export const adminRelationSchema = z.object({
    organisationId: z.string(),
    userId: z.string(),
    niveauAccès: z.string(),
});

export type AdminRelation = z.infer<typeof adminRelationSchema>;

// // Fonction pour ajouter un utilisateur (exemple d'utilisation)
// import { firestore } from 'firebase/app';
// import 'firebase/firestore';

// const db = firestore();

// export const addUser = async (user: User) => {
//     // ValIder les données avec Zod
//     userSchema.parse(user);

//     // Ajouter les données dans Firestore
//     await db.collection('users').add(user);
// };

// // Exemple d'utilisation
// const newUser: User = {
//     nom: 'Alice',
//     prenom: 'Dupont',
//     email: 'alice.dupont@example.com',
// };

// addUser(newUser).catch((error) => {
//     console.error("Erreur d'ajout de l'utilisateur :", error);
// });
