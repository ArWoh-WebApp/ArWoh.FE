"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { Auth } from "@/api/auth"
import { UserService } from "@/api/user"
import axiosInstance from "@/api/axiosInstance"
import { toast } from "sonner"

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    user: UserService.User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    updateUser: (updatedUser: Partial<UserService.User>) => void
    isPhotographer: boolean
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [user, setUser] = useState<UserService.User | null>(null)
    const [isPhotographer, setIsPhotographer] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    // Fetch user data when authenticated
    const loadUserData = useCallback(async () => {
        try {
            const response = await UserService.getUserProfile()
            if (response.isSuccess) {
                setUser(response.data)
                // Check user roles based on string values
                setIsPhotographer(response.data.role === "Photographer")
                setIsAdmin(response.data.role === "Admin")
                setIsAuthenticated(true)
                console.log("User role:", response.data.role, "isPhotographer:", response.data.role === "Photographer")
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error("Error fetching user data:", error)
            Auth.logout()
            setIsAuthenticated(false)
            setUser(null)
            setIsPhotographer(false)
            setIsAdmin(false)
        }
    }, [])

    useEffect(() => {
        const initializeAuth = async () => {
            const token = Auth.getToken()
            if (token) {
                try {
                    await axiosInstance.get("/users/me/profile") // Validate token with API
                    await loadUserData()
                } catch (error) {
                    console.error("Token validation failed:", error)
                    Auth.logout()
                }
            }
            setIsLoading(false)
        }

        initializeAuth()
    }, [loadUserData])

    // Login function
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await Auth.login({ email, password })
            if (response.isSuccess) {
                // Immediately fetch user data to get the role
                const userResponse = await UserService.getUserProfile()
                if (userResponse.isSuccess) {
                    setUser(userResponse.data)
                    setIsPhotographer(userResponse.data.role === "Photographer")
                    setIsAdmin(userResponse.data.role === "Admin")
                    setIsAuthenticated(true)
                    console.log("Login successful, role:", userResponse.data.role)
                }
                return true
            }
            toast.error(response.message || "Login failed")
            return false
        } catch (error) {
            console.error("Login error:", error)
            toast.error("An error occurred during login")
            return false
        }
    }

    // Logout function
    const logout = () => {
        Auth.logout()
        setIsAuthenticated(false)
        setUser(null)
        setIsPhotographer(false)
        setIsAdmin(false)
        toast.success("Logged out successfully")
    }

    // Update user state
    const updateUser = (updatedUser: Partial<UserService.User>) => {
        setUser((prev) => {
            if (!prev) return null
            const updated = { ...prev, ...updatedUser }
            // Update role status if role is updated
            if (updatedUser.role) {
                setIsPhotographer(updatedUser.role === "Photographer")
                setIsAdmin(updatedUser.role === "Admin")
            }
            return updated
        })
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
                updateUser,
                isPhotographer,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

