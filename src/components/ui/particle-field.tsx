"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ParticleFieldProps {
    color?: string
    particleCount?: number
    className?: string
}

const ParticleField: React.FC<ParticleFieldProps> = ({ color = "#8a2be2", particleCount = 100, className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        let mouseX = 0
        let mouseY = 0
        const mouseRadius = 150

        interface Particle {
            x: number
            y: number
            size: number
            baseX: number
            baseY: number
            density: number
            color: string
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            particles = []

            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                const size = Math.random() * 5 + 1
                const colorVariation = Math.random() * 50 - 25

                // Create a slightly varied color
                const baseColor = hexToRgb(color)
                if (!baseColor) continue

                const r = Math.max(0, Math.min(255, baseColor.r + colorVariation))
                const g = Math.max(0, Math.min(255, baseColor.g + colorVariation))
                const b = Math.max(0, Math.min(255, baseColor.b + colorVariation))
                const particleColor = `rgb(${r}, ${g}, ${b})`

                particles.push({
                    x,
                    y,
                    size,
                    baseX: x,
                    baseY: y,
                    density: Math.random() * 30 + 1,
                    color: particleColor,
                })
            }
        }

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result
                ? {
                    r: Number.parseInt(result[1], 16),
                    g: Number.parseInt(result[2], 16),
                    b: Number.parseInt(result[3], 16),
                }
                : null
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.x
            mouseY = e.y
        }

        // Initialize canvas
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        window.addEventListener("mousemove", handleMouseMove)

        // Animation loop
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((p) => {
                // Calculate distance between mouse and particle
                const dx = mouseX - p.x
                const dy = mouseY - p.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const forceDirectionX = dx / distance
                const forceDirectionY = dy / distance

                // Max distance, past which the force is 0
                const maxDistance = mouseRadius
                let force = (maxDistance - distance) / maxDistance

                // If we're too far away, force = 0
                if (force < 0) force = 0

                // Movement based on mouse position
                const directionX = forceDirectionX * force * p.density
                const directionY = forceDirectionY * force * p.density

                if (distance < mouseRadius) {
                    p.x -= directionX
                    p.y -= directionY
                } else {
                    // Return to original position
                    if (p.x !== p.baseX) {
                        const dx = p.x - p.baseX
                        p.x -= dx / 10
                    }
                    if (p.y !== p.baseY) {
                        const dy = p.y - p.baseY
                        p.y -= dy / 10
                    }
                }

                // Draw particle
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.fill()
            })

            // Connect particles with lines
            connectParticles()

            animationFrameId = requestAnimationFrame(draw)
        }

        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x
                    const dy = particles[a].y - particles[b].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        // Opacity based on distance
                        const opacity = 1 - distance / 100
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(particles[a].x, particles[a].y)
                        ctx.lineTo(particles[b].x, particles[b].y)
                        ctx.stroke()
                    }
                }
            }
        }

        draw()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [color, particleCount])

    return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}

export default ParticleField

