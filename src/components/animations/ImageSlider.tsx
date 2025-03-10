"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { ArtworkResponse } from "@/api/artwork"

type SlideDirection = "left" | "right"

interface ImageSliderProps {
    artwork: ArtworkResponse
    onPrevious: () => void
    onNext: () => void
    hasNext: boolean
    hasPrevious: boolean
}

export function ImageSlider({ artwork, onPrevious, onNext, hasNext, hasPrevious }: ImageSliderProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [slideDirection, setSlideDirection] = useState<SlideDirection>("right")

    // Reset loaded state when artwork changes
    useEffect(() => {
        setIsLoaded(false)
    }, [artwork.id])

    const handlePrevious = () => {
        if (hasPrevious) {
            setSlideDirection("left")
            onPrevious()
        }
    }

    const handleNext = () => {
        if (hasNext) {
            setSlideDirection("right")
            onNext()
        }
    }

    // Animation variants for the slider
    const slideVariants = {
        enterFromLeft: {
            x: "-100%",
            opacity: 0,
        },
        enterFromRight: {
            x: "100%",
            opacity: 0,
        },
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        },
        exitToLeft: {
            x: "-100%",
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        },
        exitToRight: {
            x: "100%",
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        },
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
                <motion.div
                    key={artwork.id}
                    className="absolute inset-0 flex items-center justify-center"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial={slideDirection === "right" ? "enterFromRight" : "enterFromLeft"}
                    animate="center"
                    exit={slideDirection === "right" ? "exitToLeft" : "exitToRight"}
                >
                    <Skeleton className="absolute inset-0 rounded-lg" />
                    <img
                        src={artwork.url || "/placeholder.svg"}
                        alt={artwork.title}
                        className={cn(
                            "transition-opacity duration-500 rounded-lg relative z-10",
                            artwork.orientation.toLowerCase() === "portrait" ? "h-full w-auto" : "w-full h-auto max-h-full",
                            isLoaded ? "opacity-100" : "opacity-0",
                        )}
                        onLoad={() => setIsLoaded(true)}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={handlePrevious}
                className={cn(
                    "absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full transition-all duration-300 z-20",
                    hasPrevious ? "opacity-100 hover:scale-110" : "opacity-50 cursor-not-allowed",
                )}
                disabled={!hasPrevious}
            >
                <ChevronLeft className="text-white" />
            </button>
            <button
                onClick={handleNext}
                className={cn(
                    "absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full transition-all duration-300 z-20",
                    hasNext ? "opacity-100 hover:scale-110" : "opacity-50 cursor-not-allowed",
                )}
                disabled={!hasNext}
            >
                <ChevronRight className="text-white" />
            </button>
        </div>
    )
}

