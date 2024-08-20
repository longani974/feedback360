import { Button } from '@/components/ui/button';
import { Link, useLoaderData } from 'react-router-dom';

const Organisation = () => {
    const organisationData = useLoaderData();

    return (
        <Link to="addUser" state={organisationData}>
            <Button>Inviter des utilisateurs</Button>
        </Link>
    );
};

export default Organisation;
