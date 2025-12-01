import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = useAuth()
    const nav = useNavigate()

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        // basic validation to avoid server-side 400 for malformed input
        if (!email.trim() || !password) {
            alert('Please enter email and password')
            return
        }
        if (!email.includes('@') || email.length < 5) {
            alert('Please enter a valid email address')
            return
        }
        setLoading(true)
        try {
            const res = await login({ email, password })
            auth.login(res.data.token, res.data.user)
            if (res.data.user.role === 'buyer') nav('/buyer')
            else if (res.data.user.role === 'seller') nav('/seller')
            else nav('/admin')
        } catch (err: any) {
            // show server-side validation detail when available
            const resp = err?.response?.data
            if (resp?.errors && Array.isArray(resp.errors)) {
                const msgs = resp.errors.map((e: any) => `${e.param || e.path || e.path || e.location || ''}: ${e.msg || e.message || JSON.stringify(e)}`)
                alert(msgs.join('\n'))
            } else {
                alert(resp?.message || 'Login failed')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="w-full max-w-md p-6 bg-white rounded shadow" onSubmit={submit}>
                <h2 className="text-2xl mb-4">Login</h2>
                <input className="w-full mb-2 p-2 border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="w-full mb-4 p-2 border" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
                <div className="mt-4 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></div>
            </form>
        </div>
    )
}
