"use client"

import { useEffect } from "react"
import { toast } from "sonner"

/**
 * Component that adds full-page protection during PrintScreen capture
 * Use this at the app level to protect all content
 */
export const PrintScreenProtection: React.FC = () => {
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

        // Function to handle Win+Shift+S
        const handleWinShiftS = (event: KeyboardEvent) => {
            // Check for Win+Shift+S combination
            if (
                (event.key === "s" || event.key === "S") &&
                event.shiftKey &&
                (event.metaKey || event.getModifierState("Meta") || event.getModifierState("OS"))
            ) {
                event.preventDefault()
                event.stopPropagation()

                // Add protection class
                document.body.classList.add("printscreen-capture")

                // Show notification
                toast.error("Screenshots are protected")

                // Remove the class after a delay
                setTimeout(() => {
                    document.body.classList.remove("printscreen-capture")
                }, 500)

                return false
            }
        }

        // Listen for key events with capture to get them early
        document.addEventListener("keydown", handlePrintScreen, true)
        document.addEventListener("keydown", handleWinShiftS, true)
        document.addEventListener("visibilitychange", handleVisibilityChange)

        // Cleanup
        return () => {
            document.removeEventListener("keydown", handlePrintScreen, true)
            document.removeEventListener("keydown", handleWinShiftS, true)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    // Add CSS rules for printscreen protection
    useEffect(() => {
        // Create style element
        const style = document.createElement("style")

        // Define CSS rules
        style.innerHTML = `
            /* Base class for protecting content during screenshots */
            .printscreen-capture img,
            .printscreen-capture canvas,
            .printscreen-capture .screenshot-protected,
            .printscreen-capture .protected-content {
                filter: brightness(0) !important;
                opacity: 0 !important;
                transition: none !important;
            }
            
            /* Add protection message overlay */
            .printscreen-capture::after {
                content: "Protected Content";
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                z-index: 999999;
            }
            
            /* Component-level protection */
            .during-capture {
                position: relative;
            }
            
            .during-capture::before {
                content: "Protected";
                position: absolute;
                inset: 0;
                background: black;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999;
            }
        `

        // Add to document
        document.head.appendChild(style)

        // Cleanup
        return () => {
            document.head.removeChild(style)
        }
    }, [])

    return null // This component doesn't render anything directly
}

export default PrintScreenProtection