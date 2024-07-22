import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto ">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Bienvenue sur Feedback 360°
                    </h1>
                    <p className="text-lg mb-8">
                        Recueillez facilement des feedbacks anonymes de vos
                        collègues.
                    </p>
                    <div className="flex justify-center gap-2">
                        <Link to="/sign-in">
                            <Button>Se connecter</Button>
                        </Link>
                        <Link to="/sign-up">
                            <Button variant="secondary">Créer un compte</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
