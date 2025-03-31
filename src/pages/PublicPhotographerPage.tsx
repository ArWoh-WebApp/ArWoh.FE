"use client"

import { useParams } from "react-router-dom"
import { PublicPhotographerProfile } from "@/components/publicPhotographerProfile"

export default function PhotographerPublicPage() {
    const { id } = useParams<{ id: string }>()
    const photographerId = id ? Number.parseInt(id, 10) : 0

    if (!photographerId) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-white/60">Invalid photographer ID</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <PublicPhotographerProfile photographerId={photographerId} />
            </div>
        </div>
    )
}

