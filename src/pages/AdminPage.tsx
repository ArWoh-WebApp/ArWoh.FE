"use client"

import { useState } from "react"
import { AdminShipping } from "@/components/admin/AdminShipping"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

type Tab = "shipping"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("shipping")
    const { isLoading, isAdmin } = useAuth()
    const navigate = useNavigate()

    // Redirect if not admin
    useEffect(() => {
        if (!isLoading && !isAdmin) {
            navigate("/")
        }
    }, [isLoading, isAdmin, navigate])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="mx-auto max-w-6xl px-4 py-8 flex-grow">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="mb-8 flex space-x-4">
                    {(["shipping"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium capitalize transition-colors",
                                activeTab === tab ? "text-white" : "text-white/60 hover:text-white",
                            )}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeAdminTab"
                                    className="absolute inset-0 rounded-lg bg-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative">{tab}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="relative min-h-[calc(100vh-16rem)]">
                    <div
                        className={cn(
                            "transition-opacity duration-300",
                            activeTab === "shipping" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0",
                        )}
                    >
                        <AdminShipping />
                    </div>
                </div>
            </div>
        </div>
    )
}
