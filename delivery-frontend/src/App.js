import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
const ProtectedRoute = ({ children }) => {
    // placeholder: the AuthContext hook would be used here in full implementation
    const token = localStorage.getItem('token');
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
};
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/buyer", element: _jsx(ProtectedRoute, { children: _jsx(BuyerDashboard, {}) }) }), _jsx(Route, { path: "/seller", element: _jsx(ProtectedRoute, { children: _jsx(SellerDashboard, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login" }) })] }) }) }));
}
