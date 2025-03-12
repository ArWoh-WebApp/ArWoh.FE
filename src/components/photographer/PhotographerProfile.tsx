"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, MapPin, LinkIcon, Loader2 } from "lucide-react"
import { photographerService } from "@/api/photographer"
import type { UserService } from "@/api/user"
import type { PhotographerImage } from "@/api/photographer"

export function PhotographerProfile() {
    const [profile, setProfile] = useState<UserService.User | null>(null)
    const [images, setImages] = useState<PhotographerImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<PhotographerImage | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const [profileRes, imagesRes] = await Promise.all([
                    photographerService.getPhotographerProfile(),
                    photographerService.getPhotographerImages(4), // Hardcoded ID for now
                ])

                if (profileRes.isSuccess) {
                    setProfile(profileRes.data)
                }
                if (imagesRes.isSuccess) {
                    setImages(imagesRes.data)
                }
            } catch (error) {
                console.error("Failed to fetch photographer data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
                {/* Avatar */}
                <div className="flex justify-center md:justify-start">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-purple-500/30">
                        <img
                            src={profile?.profilePictureUrl || "/placeholder.svg"}
                            alt={profile?.username}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                        <h1 className="text-2xl font-semibold">{profile?.username}</h1>
                        <div className="flex gap-4">
                            <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                                Follow
                            </button>
                            <button className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-xl font-semibold">{images.length}</div>
                            <div className="text-sm text-white/60">Photos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-semibold">2.5k</div>
                            <div className="text-sm text-white/60">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-semibold">180</div>
                            <div className="text-sm text-white/60">Following</div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <div className="font-medium">{profile?.username}</div>
                        <div className="text-sm text-white/60">{profile?.bio || "No bio yet"}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-white/80">
                            <div className="flex items-center gap-1">
                                <Camera className="h-4 w-4" />
                                <span>Photographer</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>Vietnam</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LinkIcon className="h-4 w-4" />
                                <a href="#" className="text-purple-400 hover:underline">
                                    portfolio.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {images.map((image) => (
                    <motion.div
                        key={image.id}
                        layoutId={`image-${image.id}`}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img src={image.url || "/placeholder.svg"} alt={image.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                                <h3 className="text-sm font-medium text-white">{image.title}</h3>
                                <p className="text-xs text-white/80">{image.price.toLocaleString("vi-VN")} ₫</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <motion.div
                    layoutId={`image-${selectedImage.id}`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg bg-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.url || "/placeholder.svg"}
                            alt={selectedImage.title}
                            className="h-full w-full object-contain"
                        />
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h3 className="text-lg font-medium text-white">{selectedImage.title}</h3>
                            <p className="mt-1 text-sm text-white/80">{selectedImage.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedImage.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-lg font-medium text-white">{selectedImage.price.toLocaleString("vi-VN")} ₫</span>
                                <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

