import { createContext, useContext, useState } from 'react'

import { API_BASE_URL } from '../api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    // Login function
    const login = async (username, password) => {
        try {
            // Fetch users from mock server
            const response = await fetch(`${API_BASE_URL}/users`)
            if (!response.ok) {
                throw new Error('Failed to fetch users')
            }

            const users = await response.json()

            // Find user by username and password
            const foundUser = users.find(
                (u) => u.username === username && u.password === password
            )

            if (foundUser) {
                setUser({ id: foundUser.id, username: foundUser.username })
                return { success: true }
            } else {
                return { success: false, error: 'Invalid username or password' }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'An unexpected error occurred' }
        }
    }

    // Logout function
    const logout = () => {
        setUser(null)
    }

    const value = {
        user,
        isAuthenticated: user !== null,

        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
