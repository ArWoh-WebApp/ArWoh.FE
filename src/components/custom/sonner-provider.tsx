"use client"

import { Toaster } from "sonner"
import { useLocation } from "react-router-dom"

export function ToastProvider() {
    const location = useLocation()

    // Calling and modify the sonner here
    // Check if we're on the ArtworkList page
    const isArtworkListPage = location.pathname === "/art-gallery"

    return <Toaster position={isArtworkListPage ? "bottom-left" : "bottom-right"} theme="light" richColors />
}

