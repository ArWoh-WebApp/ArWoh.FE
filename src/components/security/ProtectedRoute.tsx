"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        let mounted = true

        const checkAuth = async () => {
            if (!isLoading) {
                if (requireAuth && !isAuthenticated) {
                    navigate("/login", { replace: true })
                } else if (!requireAuth && isAuthenticated) {
                    navigate("/", { replace: true })
                } else if (mounted) {
                    setShouldRender(true)
                }
            }
        }

        checkAuth()

        return () => {
            mounted = false
        }
    }, [isAuthenticated, isLoading, navigate, requireAuth])

    if (isLoading || !shouldRender) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return children
}

