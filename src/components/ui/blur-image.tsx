"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    lowQualitySrc?: string
}

export function BlurImage({ src, alt, className, lowQualitySrc, ...props }: BlurImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        // Reset state when src changes
        setIsLoaded(false)
        setError(false)
    }, [src])

    return (
        <div className="relative overflow-hidden w-full h-full">
            {/* Skeleton background */}
            <Skeleton className="absolute inset-0" />

            {/* Low quality placeholder (optional) */}
            {lowQualitySrc && (
                <img
                    src={lowQualitySrc || "/placeholder.svg"}
                    alt={alt}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500",
                        isLoaded ? "opacity-0" : "opacity-100",
                    )}
                />
            )}

            {/* Main image */}
            {!error && (
                <img
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-500",
                        isLoaded ? "opacity-100" : "opacity-0",
                        className,
                    )}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setError(true)}
                    {...props}
                />
            )}
        </div>
    )
}

