"use client"

import type React from "react"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean // If false, redirect authenticated users (e.g., login page)
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                navigate("/login")
            } else if (!requireAuth && isAuthenticated) {
                navigate("/")
            }
        }
    }, [isAuthenticated, isLoading, navigate, requireAuth])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    if (requireAuth && !isAuthenticated) {
        return null
    }

    if (!requireAuth && isAuthenticated) {
        return null
    }

    return children
}

