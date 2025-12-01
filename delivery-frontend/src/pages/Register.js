import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const submit = async (e) => {
        e.preventDefault();
        // Basic client-side validation to avoid common 400 Bad Request errors
        if (!name.trim() || !email.trim() || !password) {
            alert('Please fill in name, email, and password');
            return;
        }
        if (!email.includes('@') || email.length < 5) {
            alert('Please enter a valid email');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register({ name, email, password, role });
            alert('Registered successfully');
            nav('/login');
        }
        catch (err) {
            alert(err?.response?.data?.message || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("form", { className: "w-full max-w-md p-6 bg-white rounded shadow", onSubmit: submit, children: [_jsx("h2", { className: "text-2xl mb-4", children: "Register" }), _jsx("input", { className: "w-full mb-2 p-2 border", placeholder: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { className: "w-full mb-2 p-2 border", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { type: "password", className: "w-full mb-2 p-2 border", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) }), _jsxs("select", { className: "w-full mb-4 p-2 border", value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "buyer", children: "Buyer" }), _jsx("option", { value: "seller", children: "Seller" })] }), _jsx("button", { className: "w-full bg-green-600 text-white p-2 rounded", disabled: loading, children: loading ? 'Registering...' : 'Register' }), _jsxs("div", { className: "mt-4 text-sm", children: ["Already have an account? ", _jsx(Link, { to: "/login", className: "text-blue-600", children: "Login" })] })] }) }));
}
