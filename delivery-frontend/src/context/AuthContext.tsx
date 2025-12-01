import React, { createContext, useContext, useEffect, useState } from 'react'

type User = { id: string; name: string; email: string; role: string } | null

const AuthContext = createContext<any>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User>(null)

    useEffect(() => {
        const t = localStorage.getItem('token')
        const u = localStorage.getItem('user')
        if (t) setToken(t)
        if (u) setUser(JSON.parse(u))
    }, [])

    const login = (t: string, u: User) => {
        setToken(t)
        setUser(u)
        localStorage.setItem('token', t)
        localStorage.setItem('user', JSON.stringify(u))
    }
    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // redirect to login page after logout
        try { window.location.href = '/login' } catch (e) { /* noop in non-browser env */ }
    }

    return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
