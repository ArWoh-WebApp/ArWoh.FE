/* eslint-disable react-refresh/only-export-components */
"use client"

import { useEffect } from "react"
import { toast } from "sonner"

/**
 * Custom hook to protect against PrintScreen and other screenshot methods
 * This specifically focuses on making images black during capture
 */
export const usePrintScreenProtection = () => {
    useEffect(() => {
        // Function to handle PrintScreen key
        const handlePrintScreen = (event: KeyboardEvent) => {
            if (event.key === "PrintScreen" || event.code === "PrintScreen") {
                // Add class to body to make all protected content black
                document.body.classList.add("printscreen-capture")

                // Show notification
                toast.error("Screenshots are protected")

                // Remove the class after a short delay (after screenshot is taken)
                setTimeout(() => {
                    document.body.classList.remove("printscreen-capture")
                }, 500)
            }
        }

        // Function to handle visibility change (also catches some screenshot methods)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                // Some screenshot methods trigger visibility change
                document.body.classList.add("printscreen-capture")

                // Remove after a delay
                setTimeout(() => {
                    document.body.classList.remove("printscreen-capture")
                }, 500)
            }
        }

        // Listen for key events with capture to get them early
        document.addEventListener("keydown", handlePrintScreen, true)
        document.addEventListener("visibilitychange", handleVisibilityChange)

        // Cleanup
        return () => {
            document.removeEventListener("keydown", handlePrintScreen, true)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])
}

/**
 * Component that adds a full-page overlay during PrintScreen capture
 */
export const PrintScreenProtection = () => {
    usePrintScreenProtection()

    return null // This component doesn't render anything directly
}