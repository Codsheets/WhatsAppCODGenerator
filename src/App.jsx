import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import Clients from './pages/Clients';
import Team from './pages/Team';
import Integration from './pages/Integration';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div style={{ color: 'var(--text-primary)' }}>Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="whatsapp" element={<WhatsApp />} />
                <Route path="clients" element={<Clients />} />
                <Route path="team" element={<Team />} />
                <Route path="integration" element={<Integration />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all - redirect to login if not authenticated, otherwise to dashboard */}
            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
            />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;

