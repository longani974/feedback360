import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(8, {
        message: 'Le mot de passe doit contenir au moins 8 caractères',
    }),
});

export const signupSchema = loginSchema
    .extend({
        confirmPassword: z.string().min(8, {
            message:
                'Le mot de passe de confirmation doit contenir au moins 8 caractères',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'], // Chemin d'erreur pour `confirmPassword`
    });

export const registerSchema = loginSchema.extend({
    name: z
        .string()
        .min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
});
