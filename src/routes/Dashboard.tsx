import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings, Users, FileText, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
// import { auth } from '@/firebase';

const Dashboard = () => {
    const navigate = useNavigate();
    // const userId = auth.currentUser?.uid;

    // const handleNavigation = (path: string) => {
    //     navigate(path);
    // };

    return (
        <TooltipProvider>
            <div className="container mx-auto py-8 px-4">
                {/* Section Header */}
                <div className="mb-8">
                    <p className="text-gray-600">
                        Bienvenue, gérez vos organisations et vos paramètres
                        ici.
                    </p>
                </div>

                {/* Actionable Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Organisation Overview Card */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                Mes Organisations
                            </CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Users
                                        className="w-6 h-6 text-gray-500 cursor-pointer"
                                        onClick={() =>
                                            navigate('/app/organisations')
                                        }
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voir toutes les organisations</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Accédez à vos organisations et gérez vos
                                équipes.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                onClick={() => navigate('/app/organisations')}
                            >
                                Voir les Organisations
                            </Button>
                        </CardFooter>
                    </Card>
                    {/* Feedbacks Card */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                Mes Feedbacks
                            </CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <FileText
                                        className="w-6 h-6 text-gray-500 cursor-pointer"
                                        onClick={() =>
                                            navigate('/app/feedbacks')
                                        }
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voir tous les feedbacks</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Accédez à vos feedbacks et gérez les réponses.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => navigate('/app/feedbacks')}>
                                Voir les Feedbacks
                            </Button>
                        </CardFooter>
                    </Card>
                    {/* Notifications Card */}
                    <Card className="hidden shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                Notifications
                            </CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Bell
                                        className="w-6 h-6 text-gray-500 cursor-pointer"
                                        onClick={() =>
                                            navigate('/app/notifications')
                                        }
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voir les notifications</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Restez informé des nouvelles activités et mises
                                à jour.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Badge
                                variant="outline"
                                className="bg-red-100 text-red-600"
                            >
                                3 Nouvelles
                            </Badge>
                        </CardFooter>
                    </Card>

                    {/* Settings Card */}
                    <Card className="hidden shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                Paramètres
                            </CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Settings
                                        className="w-6 h-6 text-gray-500 cursor-pointer"
                                        onClick={() =>
                                            navigate('/app/settings')
                                        }
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Configurer les paramètres</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Personnalisez votre compte et vos préférences.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => navigate('/app/settings')}>
                                Ouvrir les Paramètres
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Quick Actions Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Actions Rapides
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            className="flex items-center px-4 py-2 rounded-md shadow transition"
                            onClick={() => navigate('add-organisation')}
                        >
                            <PlusCircle className="mr-2" />
                            Créer une Nouvelle Organisation
                        </Button>
                        <Button className="flex items-center   px-4 py-2 rounded-md shadow  transition">
                            <FileText className="mr-2" />
                            Voir les Rapports
                        </Button>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default Dashboard;
