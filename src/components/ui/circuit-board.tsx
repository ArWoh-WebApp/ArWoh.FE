"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface CircuitBoardProps {
    color?: string
    density?: number
    className?: string
}

const CircuitBoard: React.FC<CircuitBoardProps> = ({
    color = "rgba(100, 100, 255, 0.5)",
    density = 0.5,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        let connections: Connection[] = []

        interface Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number
        }

        interface Connection {
            from: Particle
            to: Particle
            life: number
            maxLife: number
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            const particleCount = Math.floor(((canvas.width * canvas.height) / 15000) * density)
            particles = []
            connections = []

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 2 + 1,
                })
            }
        }

        const createConnection = () => {
            if (particles.length < 2) return

            const p1 = particles[Math.floor(Math.random() * particles.length)]
            let p2 = p1

            // Find a different particle
            while (p2 === p1) {
                p2 = particles[Math.floor(Math.random() * particles.length)]
            }

            const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))

            // Only connect if they're not too far apart
            if (distance < 200) {
                const maxLife = 50 + Math.random() * 100
                connections.push({
                    from: p1,
                    to: p2,
                    life: 0,
                    maxLife,
                })
            }
        }

        // Initialize canvas
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Animation loop
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((p) => {
                p.x += p.vx
                p.y += p.vy

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                // Draw particle
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.fill()
            })

            // Update and draw connections
            connections = connections.filter((c) => c.life < c.maxLife)
            connections.forEach((c) => {
                c.life++

                const progress = c.life / c.maxLife
                const alpha = 1 - progress

                ctx.beginPath()
                ctx.moveTo(c.from.x, c.from.y)
                ctx.lineTo(c.to.x, c.to.y)
                ctx.strokeStyle = color.replace(")", `, ${alpha})`)
                ctx.lineWidth = 1
                ctx.stroke()
            })

            // Randomly create new connections
            if (Math.random() < 0.05) {
                createConnection()
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [color, density])

    return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}

export default CircuitBoard

