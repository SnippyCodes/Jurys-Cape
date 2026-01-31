import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    devMode: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
    logout: () => void;
    toggleDevMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [devMode, setDevMode] = useState(false);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock authentication - replace with actual API call
        if (email && password) {
            const mockUser: User = {
                id: '1',
                name: 'Krushna',
                email: email,
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
        // Mock signup - replace with actual API call
        if (name && email && password) {
            const newUser: User = {
                id: Math.random().toString(),
                name: name,
                email: email,
                phone: phone,
            };
            setUser(newUser);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const toggleDevMode = () => {
        setDevMode(prev => !prev);
        if (!devMode) {
            // When enabling dev mode, auto-authenticate
            const devUser: User = {
                id: 'dev',
                name: 'Developer',
                email: 'dev@navsahayak.com',
            };
            setUser(devUser);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, devMode, login, signup, logout, toggleDevMode }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
