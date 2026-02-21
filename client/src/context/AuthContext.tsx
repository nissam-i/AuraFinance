import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
    goldBalance: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await api.get('/auth/me');
                setUser(res.data.data);
            }
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (formData: any) => {
        const res = await api.post('/auth/login', formData);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const register = async (formData: any) => {
        const res = await api.post('/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
