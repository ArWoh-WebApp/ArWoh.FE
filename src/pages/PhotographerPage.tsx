"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { PhotographerProfile } from "@/components/photographer/PhotographerProfile"
import { PhotographerRevenue } from "@/components/photographer/PhotographerRevenue"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

type Tab = "profile" | "revenue"

export default function PhotographerPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile")
    const { isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* Tabs */}
                <div className="mb-8 flex space-x-4">
                    {(["profile", "revenue"] as const).map((tab) => (
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
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-lg bg-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative">{tab}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="relative min-h-[calc(100vh-300px)]">
                    {" "}
                    {/* Increased min-height to ensure content area has enough space */}
                    <AnimatedTabContent isVisible={activeTab === "profile"}>
                        <PhotographerProfile />
                    </AnimatedTabContent>
                    <AnimatedTabContent isVisible={activeTab === "revenue"}>
                        <PhotographerRevenue />
                    </AnimatedTabContent>
                </div>
            </div>
        </div>
    )
}

function AnimatedTabContent({
    children,
    isVisible,
}: {
    children: React.ReactNode
    isVisible: boolean
}) {
    return (
        <div
            className={cn(
                "transition-opacity duration-300",
                isVisible ? "block opacity-100" : "hidden opacity-0",
            )}
        >
            {children}
        </div>
    )
}

