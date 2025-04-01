"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"

interface SecurityWrapperProps {
    children: React.ReactNode
}

export function SecurityWrapper({ children }: SecurityWrapperProps) {
    const [isProtectionActive, setIsProtectionActive] = useState(false)
    const [devToolsOpen, setDevToolsOpen] = useState(false)
    const [isCaptureAttempted, setIsCaptureAttempted] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Constant overlay visibility - helps prevent clean screenshots
    const [overlayVisible, setOverlayVisible] = useState(true)

    // Function to detect if developer tools are open
    useEffect(() => {
        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160
            const heightThreshold = window.outerHeight - window.innerHeight > 160

            // Check if dev tools are open based on window dimensions
            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    setDevToolsOpen(true)
                    toast.error("Developer tools detected. Image protection activated.")
                }
            } else if (devToolsOpen) {
                setDevToolsOpen(false)
            }
        }

        // Check for console opening
        const interval = setInterval(detectDevTools, 500)
        window.addEventListener("resize", detectDevTools)

        return () => {
            clearInterval(interval)
            window.removeEventListener("resize", detectDevTools)
        }
    }, [devToolsOpen])

    // Function to activate protection (black screen) temporarily
    const activateProtection = () => {
        setIsProtectionActive(true)
        setIsCaptureAttempted(true)

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set timeout to deactivate protection after a short delay
        timeoutRef.current = setTimeout(() => {
            setIsProtectionActive(false)

            // Keep capture attempted state for a longer period
            setTimeout(() => {
                setIsCaptureAttempted(false)
            }, 2000)
        }, 1000)
    }

    // Create a more continuous protection by cycling a subtle overlay
    useEffect(() => {
        const interval = setInterval(() => {
            setOverlayVisible(prev => !prev)
        }, 100) // Fast interval makes it harder to time screenshots

        return () => clearInterval(interval)
    }, [])

    // Disable right-click context menu
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            toast.error("Right-click is disabled for image protection")
            return false
        }

        // Monitor keyboard shortcuts with more aggressive approach
        const handleKeyDown = (e: KeyboardEvent) => {
            // For PrintScreen, we want to make all images black BEFORE the screenshot is taken
            if (e.key === "PrintScreen" || e.code === "PrintScreen") {
                // Don't try to prevent it - instead make all images black immediately
                document.body.classList.add("printscreen-capture")
                activateProtection()

                // Show the protection message
                toast.error("Screenshots are protected")

                // Remove the protection after a short delay (after screenshot is taken)
                setTimeout(() => {
                    document.body.classList.remove("printscreen-capture")
                }, 500)

                return false
            }

            // For Win+Shift+S and other combinations, try to prevent and warn
            if (
                (e.shiftKey && (e.metaKey || e.ctrlKey || e.getModifierState("Meta") || e.getModifierState("OS"))) ||
                (e.key === "s" && e.shiftKey && (e.metaKey || e.ctrlKey || e.getModifierState("Meta") || e.getModifierState("OS"))) ||
                (e.key === "S" && e.shiftKey && (e.metaKey || e.ctrlKey || e.getModifierState("Meta") || e.getModifierState("OS")))
            ) {
                e.preventDefault()
                e.stopPropagation()
                activateProtection()
                toast.error("Screenshots are protected")
                return false
            }

            // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
                (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "S" || e.key === "s" || e.key === "P" || e.key === "p"))
            ) {
                e.preventDefault()
                e.stopPropagation()
                toast.error("This keyboard shortcut is disabled for image protection")
                return false
            }
        }

        // Disable drag and drop
        const handleDragStart = (e: DragEvent) => {
            if (e.target instanceof HTMLImageElement) {
                e.preventDefault()
            }
        }

        // Add event listeners
        document.addEventListener("contextmenu", handleContextMenu)
        document.addEventListener("keydown", handleKeyDown, true) // Use capture phase for earlier interception
        document.addEventListener("dragstart", handleDragStart as EventListener)

        // Additional protection - blur images on focus loss
        const handleVisibilityChange = () => {
            if (document.visibilityState !== "visible") {
                activateProtection()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        // Cleanup
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("keydown", handleKeyDown, true)
            document.removeEventListener("dragstart", handleDragStart as EventListener)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    // Add CSS to prevent selection and make screenshots harder
    useEffect(() => {
        // Add a style tag to prevent selection and screenshots
        const style = document.createElement("style")
        style.innerHTML = `
      img, video, canvas {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        pointer-events: none !important;
      }
      
      /* Add a pseudo-element over images when dev tools are detected */
      ${devToolsOpen || isCaptureAttempted
                ? `
      img::after {
        content: "Protected Image";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 9999;
      }
      
      canvas::after {
        content: "Protected Image";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 9999;
      }
      `
                : ""
            }
    `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [devToolsOpen, isCaptureAttempted])

    // Detect and block screenshot attempts
    useEffect(() => {
        const handleClipboardEvent = () => {
            activateProtection()
        }

        document.addEventListener("copy", handleClipboardEvent)
        document.addEventListener("cut", handleClipboardEvent)

        return () => {
            document.removeEventListener("copy", handleClipboardEvent)
            document.removeEventListener("cut", handleClipboardEvent)
        }
    }, [])

    return (
        <div
            ref={wrapperRef}
            className="security-wrapper"
            style={{
                position: "relative",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            {children}

            {/* Add a constantly changing watermark overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-[9990] select-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 20px, transparent 20px, transparent 40px)",
                    opacity: overlayVisible ? 0.03 : 0.02, // Subtle flicker effect
                }}
            />

            {/* Subtle noise overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-[9991] select-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.01, // Very subtle
                }}
            />

            {/* Black overlay that appears during screenshot attempts */}
            <div
                ref={overlayRef}
                className={`fixed inset-0 bg-black z-[9999] transition-opacity duration-50 pointer-events-none ${isProtectionActive ? "opacity-100" : "opacity-0"
                    }`}
            />
        </div>
    )
}