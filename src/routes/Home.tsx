import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, BarChart, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 py-28 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold text-white tracking-tight mb-6">
                        Bienvenue sur Feedback 360°
                    </h1>
                    <p className="text-xl text-white opacity-90 mb-8">
                        La solution moderne pour recueillir des feedbacks
                        anonymes en toute simplicité.
                    </p>
                    <div className="space-x-4">
                        <Link to="/sign-in">
                            <Button
                                size="lg"
                                className="rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                            >
                                Se connecter
                            </Button>
                        </Link>
                        <Link to="/sign-up">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                            >
                                Créer un compte
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pourquoi Feedback360 Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Pourquoi choisir Feedback360 ?
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        {/* Placeholder for image */}
                        <div className="w-full md:w-1/2 h-72 bg-gray-200 rounded-lg shadow-sm"></div>
                        <div className="w-full md:w-1/2 text-left">
                            <p className="text-xl text-gray-700 leading-relaxed">
                                Feedback360 est conçu pour améliorer la
                                communication au sein de votre organisation en
                                recueillant des feedbacks anonymes. Simple,
                                sécurisé et efficace.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fonctionnalités Clés Section */}
            <section className="py-16 bg-white px-4">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Fonctionnalités Clés
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <Lock className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                <CardTitle className="text-xl font-semibold">
                                    Feedback Anonyme
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-600">
                                Assurez l’anonymat des réponses pour obtenir des
                                feedbacks honnêtes et constructifs.
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <BarChart className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                <CardTitle className="text-xl font-semibold">
                                    Rapports Automatisés
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-600">
                                Générez des rapports complets pour visualiser
                                les réponses des employés.
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <Settings className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                <CardTitle className="text-xl font-semibold">
                                    Personnalisation Facile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-600">
                                Créez des questionnaires sur mesure adaptés aux
                                besoins de votre organisation.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Cas d'Utilisation Section */}
            <section className="py-16 bg-gray-50 px-4">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Comment ça marche
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">
                                    Étape 1
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <p className="text-gray-600">
                                    Créez un questionnaire personnalisé adapté à
                                    vos besoins.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">
                                    Étape 2
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <p className="text-gray-600">
                                    Envoyez le questionnaire à vos
                                    collaborateurs et collectez des réponses
                                    anonymes.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">
                                    Étape 3
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <p className="text-gray-600">
                                    Visualisez les rapports et améliorez votre
                                    organisation.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Témoignages Section */}
            <section className="py-16 bg-white px-4">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Ils nous font confiance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent>
                                <p className="text-gray-600 italic mb-4">
                                    "Feedback360 nous a permis de mieux
                                    comprendre les attentes de nos employés tout
                                    en garantissant leur anonymat."
                                </p>
                                <p className="text-gray-700 font-bold">
                                    - Directeur RH, Entreprise XYZ
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent>
                                <p className="text-gray-600 italic mb-4">
                                    "Grâce à Feedback360, nous avons pu
                                    améliorer notre culture d'entreprise en
                                    recueillant des retours sincères."
                                </p>
                                <p className="text-gray-700 font-bold">
                                    - Responsable des opérations, Organisation
                                    ABC
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50 px-4">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl font-bold text-gray-800">FAQ</h2>
                    <div className="text-left space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">
                                Comment garantissez-vous l'anonymat ?
                            </h3>
                            <p className="text-gray-600">
                                Les réponses sont collectées sans identifiants
                                personnels et ne peuvent pas être associées à
                                des utilisateurs spécifiques.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">
                                Quels sont les types de rapports disponibles ?
                            </h3>
                            <p className="text-gray-600">
                                Vous pouvez générer des rapports détaillés avec
                                des graphiques et des statistiques pour analyser
                                les retours.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">
                                Est-ce que Feedback360 est gratuit ?
                            </h3>
                            <p className="text-gray-600">
                                Il existe un plan gratuit avec des
                                fonctionnalités de base et un plan premium pour
                                des fonctionnalités avancées.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                    Commencez à recueillir des feedbacks dès aujourd'hui
                </h2>
                <Link to="/sign-up">
                    <Button
                        size="lg"
                        className="rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                    >
                        Créer un compte
                    </Button>
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="text-center">
                    <p>&copy; 2024 Feedback360. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
