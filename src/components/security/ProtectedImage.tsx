/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt: string
    className?: string
    watermarkText?: string
    noiseIntensity?: number
}

export function ProtectedImage({
    src,
    alt,
    className,
    watermarkText = "Protected",
    noiseIntensity = 5, // Increased noise
    ...props
}: ProtectedImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [isLoaded, setIsLoaded] = useState(false)
    const [tickCount, setTickCount] = useState(0)

    // Function to add dynamic noise that changes over time
    const updateDynamicNoise = useCallback(() => {
        const overlayCanvas = overlayCanvasRef.current
        if (!overlayCanvas || !isLoaded) return

        const ctx = overlayCanvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        // Create noise pattern that changes slightly over time
        const imageData = ctx.createImageData(overlayCanvas.width, overlayCanvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
            // Only modify every several pixels for performance
            if (i % 10 === (tickCount % 10)) {
                const noise = Math.random() * 5 - 2.5
                data[i] = 128 + noise      // R
                data[i + 1] = 128 + noise  // G
                data[i + 2] = 128 + noise  // B
                data[i + 3] = 1            // Very low alpha
            } else {
                data[i + 3] = 0            // Transparent
            }
        }

        ctx.putImageData(imageData, 0, 0)

        // Increment tick count for animation
        setTickCount(prev => prev + 1)
    }, [isLoaded, tickCount])

    // Load image into canvas instead of direct img tag
    useEffect(() => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = src

        img.onload = () => {
            setDimensions({
                width: img.width,
                height: img.height,
            })

            const canvas = canvasRef.current
            if (canvas) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true })
                if (ctx) {
                    // Draw the image
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                    // Add noise to the image to make screenshots less useful
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const data = imageData.data

                    // Add stronger noise pattern that's harder to remove
                    for (let i = 0; i < data.length; i += 4) {
                        // Add structured noise pattern
                        const x = (i / 4) % canvas.width
                        const y = Math.floor((i / 4) / canvas.width)

                        // Create a more complex pattern
                        if ((x + y) % 7 === 0 || (x * y) % 13 === 1) {
                            data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() * noiseIntensity * 2 - noiseIntensity)))
                            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() * noiseIntensity * 2 - noiseIntensity)))
                            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() * noiseIntensity * 2 - noiseIntensity)))
                        }
                    }

                    ctx.putImageData(imageData, 0, 0)

                    // Add multiple layers of watermarks with different opacities and rotations
                    if (watermarkText) {
                        // First watermark layer
                        ctx.save()
                        ctx.globalAlpha = 0.08
                        ctx.font = "14px Arial"
                        ctx.fillStyle = "white"
                        ctx.translate(canvas.width / 2, canvas.height / 2)
                        ctx.rotate(-Math.PI / 6)

                        for (let i = -canvas.height; i < canvas.height * 2; i += 60) {
                            for (let j = -canvas.width; j < canvas.width * 2; j += 200) {
                                ctx.fillText(watermarkText, j, i)
                            }
                        }
                        ctx.restore()

                        // Second watermark layer with different angle
                        ctx.save()
                        ctx.globalAlpha = 0.05
                        ctx.font = "10px Arial"
                        ctx.fillStyle = "white"
                        ctx.translate(canvas.width / 2, canvas.height / 2)
                        ctx.rotate(Math.PI / 4)

                        for (let i = -canvas.height; i < canvas.height * 2; i += 40) {
                            for (let j = -canvas.width; j < canvas.width * 2; j += 150) {
                                ctx.fillText(watermarkText, j, i)
                            }
                        }
                        ctx.restore()
                    }

                    setIsLoaded(true)
                }
            }
        }

        img.onerror = () => {
            console.error("Failed to load image")
        }
    }, [src, watermarkText, noiseIntensity])

    // Set up dynamic noise animation
    useEffect(() => {
        if (!isLoaded) return

        // Update dynamic noise initially
        updateDynamicNoise()

        // Set up interval for continuous updates
        const interval = setInterval(updateDynamicNoise, 100) // Fast updates for protection

        return () => clearInterval(interval)
    }, [isLoaded, updateDynamicNoise])

    // Add keyboard event listeners specifically for this component
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "PrintScreen" ||
                e.code === "PrintScreen" ||
                (e.shiftKey && (e.metaKey || e.ctrlKey || e.getModifierState("Meta") || e.getModifierState("OS")))
            ) {
                // Blur the image on screenshot attempt
                const canvas = canvasRef.current
                if (canvas && isLoaded) {
                    const ctx = canvas.getContext('2d')
                    if (ctx) {
                        // Apply a temporary strong blur filter
                        ctx.filter = 'blur(10px)'
                        const img = new Image()
                        img.src = canvas.toDataURL()
                        img.onload = () => {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                            // Reset after a short delay
                            setTimeout(() => {
                                ctx.filter = 'none'
                                const originalImg = new Image()
                                originalImg.src = src
                                originalImg.crossOrigin = "anonymous"
                                originalImg.onload = () => {
                                    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height)
                                }
                            }, 1000)
                        }
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown, true)
        return () => document.removeEventListener('keydown', handleKeyDown, true)
    }, [isLoaded, src])

    // Add a CSS class to handle screenshot protection
    const imageClass = cn(
        "w-full h-full object-cover transition-all duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        "screenshot-protected", // Add a class we can target with CSS
    )

    return (
        <div className={cn("relative overflow-hidden", className)} {...props}>
            {/* Main image canvas */}
            <canvas
                ref={canvasRef}
                width={dimensions.width || 300}
                height={dimensions.height || 200}
                className={imageClass}
                style={{
                    pointerEvents: "none",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    position: "relative",
                    zIndex: 1,
                }}
            />

            {/* Dynamic noise overlay canvas */}
            <canvas
                ref={overlayCanvasRef}
                width={dimensions.width || 300}
                height={dimensions.height || 200}
                className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5"
                style={{
                    mixBlendMode: "difference",
                    zIndex: 2,
                }}
            />

            {/* Loading placeholder */}
            {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

            {/* Additional invisible layer that becomes visible on screenshot */}
            <div
                className="absolute inset-0 bg-transparent pointer-events-none screenshot-reveal"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='32' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${watermarkText}%3C/text%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    zIndex: 3,
                    opacity: 0,
                }}
            />
        </div>
    )
}