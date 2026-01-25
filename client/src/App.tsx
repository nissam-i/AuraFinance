import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

import Wallet from './pages/Wallet';
import Analytics from './pages/Analytics';

const PrivateRoute = ({ children }: { children: any }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="wallet" element={<Wallet />} />
                        <Route path="analytics" element={<Analytics />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
