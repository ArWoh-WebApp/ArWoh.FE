"use client"

import { Heart, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { BlurImage } from "@/components/ui/blur-image"
import type { ArtworkResponse } from "@/api/artwork"

interface ArtworkCardProps {
    artwork: ArtworkResponse
    onClick: () => void
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative group rounded-lg overflow-hidden cursor-pointer",
                artwork.orientation.toLowerCase() === "portrait" ? "row-span-2" : "row-span-1",
            )}
        >
            {/* Image with progressive loading */}
            <BlurImage src={artwork.url || "/placeholder.svg"} alt={artwork.title} className="w-full h-full object-cover" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            // Handle like
                        }}
                    >
                        <Heart className="w-4 h-4 text-white" />
                    </button>
                    <button
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            // Handle add to collection
                        }}
                    >
                        <Plus className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded">
                    <span className="text-white text-sm font-medium">{artwork.price.toLocaleString("vi-VN")} ₫</span>
                </div>
            </div>

            {/* Tags */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-all duration-300 z-10">
                <div className="flex flex-wrap gap-2">
                    {artwork.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-lg bg-white/20 text-white text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

