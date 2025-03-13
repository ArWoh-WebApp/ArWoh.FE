"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
    requirePhotographer?: boolean
    requireAdmin?: boolean
}

export function ProtectedRoute({
    children,
    requireAuth = true,
    requirePhotographer = false,
    requireAdmin = false,
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, isPhotographer, isAdmin } = useAuth()
    const navigate = useNavigate()
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        let mounted = true

        // Vallidate tất cả trường hợp
        const checkAuth = async () => {
            if (!isLoading) {
                // Check if authentication is required but user is not authenticated
                if (requireAuth && !isAuthenticated) {
                    navigate("/login", { replace: true })
                }
                // Check if photographer role is required but user is not a photographer
                else if (requireAuth && requirePhotographer && !isPhotographer) {
                    navigate("/user-profile", { replace: true })
                }
                // Check if admin role is required but user is not an admin
                else if (requireAuth && requireAdmin && !isAdmin) {
                    navigate("/user-profile", { replace: true })
                }
                // Check if user is authenticated but shouldn't be (like login page)
                else if (!requireAuth && isAuthenticated) {
                    // Redirect to appropriate dashboard based on role
                    if (isAdmin) {
                        navigate("/admin", { replace: true })
                    } else if (isPhotographer) {
                        navigate("/photographer-profile", { replace: true }) // Updated to the correct route
                    } else {
                        navigate("/user-profile", { replace: true })
                    }
                }
                // All checks passed, render the component
                else if (mounted) {
                    setShouldRender(true)
                }
            }
        }

        checkAuth()

        return () => {
            mounted = false
        }
    }, [isAuthenticated, isLoading, isPhotographer, isAdmin, navigate, requireAuth, requirePhotographer, requireAdmin])

    if (isLoading || !shouldRender) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return children
}

