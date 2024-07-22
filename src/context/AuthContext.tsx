import { account } from '@/lib/appWrite/config';
import { Models } from 'appwrite';
import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

type User = Models.User<Models.Preferences> | null;

type UserContextType = {
    user: User;
    setUser: React.Dispatch<User>;
    logout: () => Promise<void>;
};
export const AuthContext = createContext<UserContextType | null>(null);

export const AuthProvider = () => {
    const loaderData = useLoaderData() as { user?: User }; // Spécifiez le type de loaderData
    const [user, setUser] = useState<User>(loaderData?.user ?? null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);
            } catch (error) {
                console.log(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (!loaderData || !loaderData.user) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [loaderData]);

    const logout = async () => {
        try {
            await account.deleteSessions();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            <Outlet />
        </AuthContext.Provider>
    );
};

export const useAuth = (): UserContextType => {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
