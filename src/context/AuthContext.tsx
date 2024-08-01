// src/context/AuthContext.tsx
import { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth'; // Importer le type User
import { auth } from '@/firebase';

type UserContextType = {
    user: User | null | undefined;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<UserContextType | null>(null);

export const AuthProvider = () => {
    const [user, loading, error] = useAuthState(auth);
    const [signOut, signOutLoading, signOutError] = useSignOut(auth);

    const logout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading || signOutLoading) {
        return <div>Loading...</div>;
    }

    if (error || signOutError) {
        return <div>Error: {error?.message || signOutError?.message}</div>;
    }

    return (
        <AuthContext.Provider value={{ user, logout }}>
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
