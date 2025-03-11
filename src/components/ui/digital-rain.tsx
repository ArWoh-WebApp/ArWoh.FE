"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface DigitalRainProps {
    color?: string
    speed?: number
    density?: number
    className?: string
}

const DigitalRain: React.FC<DigitalRainProps> = ({ color = "#0f0", speed = 1, density = 0.05, className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        //let columns: number[] = []
        let drops: number[] = []
        const fontSize = 14

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // Calculate columns and initialize drops
            const columns_count = Math.floor(canvas.width / fontSize)
            //columns = Array.from({ length: columns_count }, () => 0)
            drops = Array.from({ length: columns_count }, () => 1)

            // Set font
            ctx.font = `${fontSize}px monospace`
        }

        // Initialize canvas
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Characters to display
        const chars =
            "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"

        // Animation loop
        const draw = () => {
            // Semi-transparent black background to create fade effect
            ctx.fillStyle = `rgba(0, 0, 0, 0.05)`
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Set text color
            ctx.fillStyle = color

            // Loop through each column
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = chars[Math.floor(Math.random() * chars.length)]

                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                // Randomly reset some drops to the top
                if (drops[i] * fontSize > canvas.height && Math.random() > 1 - density) {
                    drops[i] = 0
                }

                // Move drop down
                drops[i] += speed * (0.5 + Math.random() * 0.5)
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [color, speed, density])

    return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}

export default DigitalRain

