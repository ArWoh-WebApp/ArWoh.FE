"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Auth } from "@/api/auth"
import { toast } from "sonner"

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    user: any | null // We'll type this properly when we have the user interface
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any | null>(null)
    const navigate = useNavigate()

    const checkAuth = useCallback(async () => {
        try {
            const token = Auth.getToken()
            if (!token) {
                setIsAuthenticated(false)
                setUser(null)
                return
            }

            // Here you would typically validate the token with your backend
            // and fetch the user data
            // const userData = await Auth.getCurrentUser()
            // setUser(userData)

            setIsAuthenticated(true)
        } catch (error) {
            console.error("Auth check failed:", error)
            setIsAuthenticated(false)
            setUser(null)
            Auth.logout()
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    const login = async (email: string, password: string) => {
        try {
            const response = await Auth.login({ email, password })
            if (response.isSuccess) {
                setIsAuthenticated(true)

                // Fetch and set user data here
                // const userData = await Auth.getCurrentUser()
                // setUser(userData)

                toast.success("Login successful")
                navigate("/user-profile")
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error("Login failed:", error)
            toast.error("An error occurred during login")
        }
    }

    const logout = () => {
        Auth.logout()
        setIsAuthenticated(false)
        setUser(null)
        navigate("/login")
        toast.success("Logged out successfully")
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

