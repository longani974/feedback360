import { Button } from '@/components/ui/button';
import { Link, useLoaderData } from 'react-router-dom';

const Organisation = () => {
    const organisationData = useLoaderData();

    return (
        <div className="flex flex-col gap-2">
            <Link to="addUser" state={organisationData}>
                <Button>Inviter des utilisateurs</Button>
            </Link>
            <Link to="/app/feedbacks/create" state={organisationData}>
                <Button>Créer un feedback</Button>
            </Link>
        </div>
    );
};

export default Organisation;
