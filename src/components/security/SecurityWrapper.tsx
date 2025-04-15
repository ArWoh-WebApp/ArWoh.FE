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
    const wrapperRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Track if we've already shown a toast to prevent spam
    const hasShownToastRef = useRef<{
        devTools: boolean
        rightClick: boolean
        screenshot: boolean
        shortcut: boolean
    }>({
        devTools: false,
        rightClick: false,
        screenshot: false,
        shortcut: false,
    })

    // Function to detect if developer tools are open - less aggressive
    useEffect(() => {
        const detectDevTools = () => {
            // More lenient thresholds to reduce false positives
            const widthThreshold = window.outerWidth - window.innerWidth > 200
            const heightThreshold = window.outerHeight - window.innerHeight > 200

            // Check if dev tools are open based on window dimensions
            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    setDevToolsOpen(true)
                    if (!hasShownToastRef.current.devTools) {
                        toast.error("Developer tools detected. Image protection activated.")
                        hasShownToastRef.current.devTools = true
                    }
                }
            } else if (devToolsOpen) {
                setDevToolsOpen(false)
                // Reset toast flag when dev tools are closed
                hasShownToastRef.current.devTools = false
            }
        }

        // Check less frequently to reduce performance impact
        const interval = setInterval(detectDevTools, 2000)

        // Only check on resize, not constantly
        window.addEventListener("resize", detectDevTools)

        return () => {
            clearInterval(interval)
            window.removeEventListener("resize", detectDevTools)
        }
    }, [devToolsOpen])

    // Function to activate protection (black screen) temporarily
    const activateProtection = () => {
        setIsProtectionActive(true)

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set timeout to deactivate protection after a short delay
        timeoutRef.current = setTimeout(() => {
            setIsProtectionActive(false)
        }, 1000)
    }

    // Disable right-click context menu
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            // Only prevent right-click on images, not the entire page
            if (
                e.target instanceof HTMLImageElement ||
                e.target instanceof HTMLCanvasElement ||
                e.target instanceof HTMLVideoElement
            ) {
                e.preventDefault()
                if (!hasShownToastRef.current.rightClick) {
                    toast.error("Right-click is disabled for image protection")
                    hasShownToastRef.current.rightClick = true
                    // Reset after a delay
                    setTimeout(() => {
                        hasShownToastRef.current.rightClick = false
                    }, 5000)
                }
                return false
            }
        }

        // Monitor keyboard shortcuts with more targeted approach
        const handleKeyDown = (e: KeyboardEvent) => {
            // For PrintScreen, we want to make all images black BEFORE the screenshot is taken
            if (e.key === "PrintScreen" || e.code === "PrintScreen") {
                activateProtection()
                if (!hasShownToastRef.current.screenshot) {
                    toast.error("Screenshots are protected")
                    hasShownToastRef.current.screenshot = true
                    setTimeout(() => {
                        hasShownToastRef.current.screenshot = false
                    }, 5000)
                }
                return false
            }

            // For Win+Shift+S and other combinations, try to prevent and warn
            if (
                (e.key === "s" || e.key === "S") &&
                e.shiftKey &&
                (e.metaKey || e.ctrlKey || e.getModifierState("Meta") || e.getModifierState("OS"))
            ) {
                e.preventDefault()
                e.stopPropagation()
                activateProtection()
                if (!hasShownToastRef.current.screenshot) {
                    toast.error("Screenshots are protected")
                    hasShownToastRef.current.screenshot = true
                    setTimeout(() => {
                        hasShownToastRef.current.screenshot = false
                    }, 5000)
                }
                return false
            }

            // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
                (e.ctrlKey && (e.key === "U" || e.key === "u"))
            ) {
                e.preventDefault()
                e.stopPropagation()
                if (!hasShownToastRef.current.shortcut) {
                    toast.error("This keyboard shortcut is disabled for image protection")
                    hasShownToastRef.current.shortcut = true
                    setTimeout(() => {
                        hasShownToastRef.current.shortcut = false
                    }, 5000)
                }
                return false
            }
        }

        // Disable drag and drop only for images
        const handleDragStart = (e: DragEvent) => {
            if (e.target instanceof HTMLImageElement) {
                e.preventDefault()
            }
        }

        // Add event listeners
        document.addEventListener("contextmenu", handleContextMenu)
        document.addEventListener("keydown", handleKeyDown, true) // Use capture phase for earlier interception
        document.addEventListener("dragstart", handleDragStart as EventListener)

        // Cleanup
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("keydown", handleKeyDown, true)
            document.removeEventListener("dragstart", handleDragStart as EventListener)
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
      ${devToolsOpen
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
      `
                : ""
            }
    `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [devToolsOpen])

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

            {/* Add an invisible watermark on all pages - static, not changing */}
            <div
                className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.02] select-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 20px, transparent 20px, transparent 40px)",
                }}
            />

            {/* Black overlay that appears during screenshot attempts */}
            <div
                ref={overlayRef}
                className={`fixed inset-0 bg-black z-[9999] transition-opacity duration-100 pointer-events-none ${isProtectionActive ? "opacity-100" : "opacity-0"
                    }`}
            />
        </div>
    )
}
