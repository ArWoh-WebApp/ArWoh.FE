/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { artworkService, type ArtworkResponse } from "@/api/artwork"
import { ThreeDCard } from "@/components/ui/3d-card"
import { RichTextContent } from "@/components/richText/RichTextContent"
import { Loader2, ArrowDown, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function StoryOfArtPage() {
    const [artworks, setArtworks] = useState<ArtworkResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Fetch random artworks on component mount
    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setIsLoading(true)
                const response = await artworkService.getRandomArtwork()
                if (response.isSuccess) {
                    setArtworks(response.data)
                } else {
                    setError(response.message)
                }
            } catch (err) {
                setError("Failed to load artworks")
            } finally {
                setIsLoading(false)
            }
        }

        fetchArtworks()
    }, [])

    // Handle view photographer click
    const handleViewPhotographer = (photographerId: number) => {
        navigate(`/photographer/${photographerId}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-950/20 to-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                    <p className="text-white/60">Loading stories...</p>
                </div>
            </div>
        )
    }

    if (error || artworks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-950/20 to-black">
                <div className="max-w-md text-center p-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
                    <p className="text-white/60 mb-6">{error || "No artworks found"}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden"
        >
            {/* Animated particles background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-purple-500"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                        animate={{
                            x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                            opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.2 + 0.1],
                        }}
                        transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: Math.random() * 10 + 20,
                            repeatType: "reverse",
                        }}
                        style={{
                            width: Math.random() * 3 + 1 + "px",
                            height: Math.random() * 3 + 1 + "px",
                        }}
                    />
                ))}
            </div>

            {/* Hero section with scroll indicator */}
            <div className="h-screen relative flex flex-col items-center justify-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Stories Behind The Art
                    </motion.h1>
                    <motion.p
                        className="text-white/60 text-center max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Discover the inspiration, meaning, and journey behind each artwork. Scroll down to explore the stories that
                        bring these images to life.
                    </motion.p>
                </div>

                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <p className="mb-2 text-sm">Scroll to explore</p>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                    >
                        <ArrowDown className="h-6 w-6" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Artwork sections with alternating layouts */}
            {artworks.map((artwork, index) => (
                <ArtworkSection key={artwork.id} artwork={artwork} index={index} onViewPhotographer={handleViewPhotographer} />
            ))}
        </div>
    )
}

interface ArtworkSectionProps {
    artwork: ArtworkResponse
    index: number
    onViewPhotographer: (id: number) => void
}

function ArtworkSection({ artwork, index, onViewPhotographer }: ArtworkSectionProps) {
    const isEven = index % 2 === 0
    const sectionRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    })

    // Create separate progress trackers for text and image to stagger them slightly
    const textProgress = useTransform(scrollYProgress, (value) => Math.min(value * 1.1, 1))
    const imageProgress = useTransform(scrollYProgress, (value) => Math.min(value * 1.05, 1))

    const textOpacity = useTransform(textProgress, [0, 0.25, 0.4, 0.8, 1], [0, 0.5, 1, 1, 0])

    const imageOpacity = useTransform(imageProgress, [0, 0.25, 0.4, 0.8, 1], [0, 0.5, 1, 1, 0])

    return (
        <section ref={sectionRef} className="min-h-screen py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
                <div className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? "" : "md:grid-flow-dense"}`}>
                    {/* Text Content */}
                    <motion.div
                        className="space-y-6"
                        style={{ opacity: textOpacity }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="space-y-2">
                            <p className="text-sm text-purple-400">Story of Art</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">{artwork.title}</h2>

                            {artwork.photographerId && (
                                <button
                                    className="flex items-center gap-2 text-white/60 hover:text-purple-400 transition-colors text-sm mt-2"
                                    onClick={() => onViewPhotographer(artwork.photographerId)}
                                >
                                    By {artwork.photographerName || "Unknown Artist"}
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            {artwork.location && (
                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                    <MapPin className="h-3 w-3" />
                                    <span>{artwork.location}</span>
                                </div>
                            )}

                            {artwork.tags && artwork.tags.length > 0 && (
                                <div className="flex items-center gap-1 text-white/60 text-sm">
                                    <Tag className="h-3 w-3" />
                                    <span>{artwork.tags.slice(0, 3).join(", ")}</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-medium text-white mb-3">The Story</h3>
                            {artwork.storyOfArt && artwork.storyOfArt.startsWith("<") ? (
                                <RichTextContent
                                    html={artwork.storyOfArt}
                                    className="text-white/80 prose prose-invert prose-sm max-w-none"
                                />
                            ) : (
                                <p className="text-white/80">{artwork.storyOfArt || "No story available for this artwork."}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <p className="text-xl font-bold text-white mb-2">{artwork.price.toLocaleString("vi-VN")} ₫</p>
                            <Button
                                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
                                onClick={() => (window.location.href = `/art-gallery`)}
                            >
                                View in Gallery
                            </Button>
                        </div>
                    </motion.div>

                    {/* Image with 3D effect */}
                    <motion.div
                        style={{ opacity: imageOpacity }}
                        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                        className="h-[700px] w-full aspect-square"
                    >
                        <ThreeDCard className="relative w-full h-full">
                            <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center bg-black/20">
                                    <motion.img
                                        src={artwork.url || "/placeholder.svg"}
                                        alt={artwork.title}
                                        className={`w-full h-full ${artwork.orientation.toLowerCase() === "portrait" ? "object-cover" : "object-cover"} rounded-3xl`}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-transparent pointer-events-none" />

                            {/* Floating badges */}
                            <motion.div
                                className="absolute -top-5 -right-5 bg-gradient-to-br from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, scale: 1.05 }}
                            >
                                {artwork.orientation.charAt(0).toUpperCase() + artwork.orientation.slice(1)}
                            </motion.div>

                            {artwork.tags && artwork.tags.length > 0 && (
                                <motion.div
                                    className="absolute -bottom-5 -left-5 bg-white text-purple-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                                    initial={{ y: -20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: 5, scale: 1.05 }}
                                >
                                    {artwork.tags[0]}
                                </motion.div>
                            )}
                        </ThreeDCard>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

