import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/shared/Header';
import Footer from '@/components/ui/shared/Footer';

const PublicLayout = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default PublicLayout;
