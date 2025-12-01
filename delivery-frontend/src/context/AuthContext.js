import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        if (t)
            setToken(t);
        if (u)
            setUser(JSON.parse(u));
    }, []);
    const login = (t, u) => {
        setToken(t);
        setUser(u);
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
    };
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // redirect to login page after logout
        try {
            window.location.href = '/login';
        }
        catch (e) { /* noop in non-browser env */ }
    };
    return _jsx(AuthContext.Provider, { value: { token, user, login, logout }, children: children });
};
export const useAuth = () => useContext(AuthContext);
