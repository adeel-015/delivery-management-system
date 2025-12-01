import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('buyer')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Basic client-side validation to avoid common 400 Bad Request errors
        if (!name.trim() || !email.trim() || !password) {
            alert('Please fill in name, email, and password')
            return
        }
        if (!email.includes('@') || email.length < 5) {
            alert('Please enter a valid email')
            return
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters')
            return
        }
        setLoading(true)
        try {
            await register({ name, email, password, role })
            alert('Registered successfully')
            nav('/login')
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Registration failed')
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="w-full max-w-md p-6 bg-white rounded shadow" onSubmit={submit}>
                <h2 className="text-2xl mb-4">Register</h2>
                <input className="w-full mb-2 p-2 border" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="w-full mb-2 p-2 border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="w-full mb-2 p-2 border" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <select className="w-full mb-4 p-2 border" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
                <button className="w-full bg-green-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                <div className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></div>
            </form>
        </div>
    )
}
