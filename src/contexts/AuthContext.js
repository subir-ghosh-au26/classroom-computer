import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for ES6 modules
import api, { getMe } from '../services/api'; // Assuming getMe is exported from api.js

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    // Check if token is expired
                    if (decodedToken.exp * 1000 < Date.now()) {
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        // Token is valid, fetch user details
                        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Handled by interceptor
                        const { data } = await getMe(); // Fetch user from backend using /auth/me
                        if (data && data.role === 'admin') { // Ensure only admin can use admin portal
                            setUser(data);
                        } else {
                            localStorage.removeItem('token'); // Not an admin or invalid user
                            setUser(null);
                            setError("Access denied. Admin role required.");
                        }
                    }
                } catch (err) {
                    console.error('Auth initialization error:', err);
                    localStorage.removeItem('token');
                    setUser(null);
                    setError(err.response?.data?.message || "Failed to initialize session.");
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', { username, password });
            const { token, role } = response.data;

            if (role !== 'admin') {
                setError("Access denied. Admin role required.");
                return false;
            }

            localStorage.setItem('token', token);
            // api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Handled by interceptor
            const { data: userData } = await getMe(); // Fetch full user details
            setUser(userData);
            return true;
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            setUser(null);
            localStorage.removeItem('token');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        // delete api.defaults.headers.common['Authorization']; // Handled by interceptor logic on next request
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);