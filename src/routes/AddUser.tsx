import { AuthForm } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useActionData, useNavigate, useNavigation } from 'react-router-dom';

type ActionData = {
    success?: boolean;
    error?: string;
    errors?: {
        email?: string[];
    };
    email?: string;
};

const AddUser = () => {
    const actionData = useActionData() as ActionData | undefined;
    const navigation = useNavigation();
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Définitions des paramètres pour l'email
    const subject =
        'Invitation à rejoindre Feedback360 - Donnez votre avis en quelques clics';
    const body = `
        Bonjour,

        Vous avez été invité à rejoindre Feedback360, une plateforme dédiée aux retours d'expérience et à l'amélioration continue dans votre organisation.

        En tant qu'utilisateur de Feedback360, vous pourrez :
        - Répondre à des questionnaires pour donner votre avis sur différents sujets.
        - Aider votre organisation à améliorer ses processus et son environnement de travail grâce à vos retours.

        Pour commencer, veuillez copier-coller le lien ci-dessous dans votre navigateur afin de vous inscrire et d'accéder à votre espace personnalisé :

        http://localhost:5173/app/

        Si vous avez des questions, n'hésitez pas à me contacter ou à répondre à cet email.

        Cordialement
    `;

    useEffect(() => {
        if (actionData?.success) {
            navigate('/app');
        }
        if (actionData?.email) {
            setUserEmail(actionData.email);
        }
    }, [actionData, navigate]);

    const handleServiceClick = () => {
        let mailLink = '';
        if (selectedService === 'gmail') {
            mailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else if (selectedService === 'outlook') {
            mailLink = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${userEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            mailLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        window.open(mailLink, '_blank');
    };

    return (
        <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
            <Card className="w-[350px]">
                <CardHeader className="text-2xl font-semibold">
                    <CardTitle>Inviter une personne</CardTitle>
                    <CardDescription>
                        Invitez une personne pour lui proposer des
                        questionnaires.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm
                        submitText="Ajouter l'Utilisateur"
                        fields={[
                            {
                                name: 'email',
                                label: `Email de l'Utilisateur`,
                                type: 'text',
                            },
                        ]}
                        isSubmitting={navigation.state === 'submitting'}
                        error={actionData?.error}
                        fieldErrors={actionData?.errors}
                    />
                </CardContent>
                <CardFooter>
                    {actionData?.error && (
                        <div>
                            {/* Explication claire sur pourquoi on propose de choisir un service de messagerie */}
                            <p className="mb-2 text-gray-600">
                                Si cette personne n'est pas encore inscrite,
                                vous pouvez l'inviter par email. Choisissez un
                                service de messagerie ci-dessous pour envoyer
                                une invitation.
                            </p>

                            {/* Affichage des options de service */}
                            <RadioGroup
                                defaultValue={selectedService}
                                onValueChange={setSelectedService}
                                className="mt-4 space-y-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="gmail" id="gmail" />
                                    <Label htmlFor="gmail">Gmail</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="outlook"
                                        id="outlook"
                                    />
                                    <Label htmlFor="outlook">Outlook</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="mailto"
                                        id="mailto"
                                    />
                                    <Label htmlFor="mailto">
                                        Client par défaut
                                    </Label>
                                </div>
                            </RadioGroup>

                            {selectedService && (
                                <div className="mt-4">
                                    <p className="mb-2 text-sm text-gray-600">
                                        <strong>Instructions :</strong> Avant
                                        d'envoyer l'email, n'oubliez pas de
                                        personnaliser le message. Vous pouvez
                                        ajouter une signature personnalisée, un
                                        lien cliquable, et tout autre élément
                                        nécessaire pour que le message soit
                                        adapté à votre style.
                                    </p>

                                    <Button onClick={handleServiceClick}>
                                        Envoyer via{' '}
                                        {selectedService === 'gmail'
                                            ? 'Gmail'
                                            : selectedService === 'outlook'
                                              ? 'Outlook'
                                              : 'le client par défaut'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default AddUser;
