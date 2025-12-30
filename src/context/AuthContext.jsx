import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [sheetId, setSheetId] = useState('');
    const [loading, setLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('crm_auth');
        if (storedAuth) {
            try {
                const authData = JSON.parse(storedAuth);
                setIsAuthenticated(true);
                setUser(authData.user);
                setSheetId(authData.sheetId);
            } catch (error) {
                console.error('Failed to parse auth data:', error);
                localStorage.removeItem('crm_auth');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, userSheetId) => {
        const authData = {
            user: userData,
            sheetId: userSheetId,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('crm_auth', JSON.stringify(authData));
        setIsAuthenticated(true);
        setUser(userData);
        setSheetId(userSheetId);
    };

    const logout = () => {
        localStorage.removeItem('crm_auth');
        setIsAuthenticated(false);
        setUser(null);
        setSheetId('');
    };

    const value = {
        isAuthenticated,
        user,
        sheetId,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
