"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, MapPin, Loader2 } from "lucide-react"
import { photographerService } from "@/api/photographer"
import type { UserService } from "@/api/user"
import type { PhotographerImage } from "@/api/photographer"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export function PhotographerProfile() {
    const [profile, setProfile] = useState<UserService.User | null>(null)
    const [images, setImages] = useState<PhotographerImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<PhotographerImage | null>(null)
    const [animationKey, setAnimationKey] = useState(0) // Key to force animation reset

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const imagesPerPage = 6 // Show 6 images per page (2 rows of 3 on desktop)

    // Reset animation when tab changes
    useEffect(() => {
        // This will trigger a re-render and reset animations
        setAnimationKey((prev) => prev + 1)
    }, [])

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

    // Calculate pagination
    const totalPages = Math.ceil(images.length / imagesPerPage)
    const indexOfLastImage = currentPage * imagesPerPage
    const indexOfFirstImage = indexOfLastImage - imagesPerPage
    const currentImages = images.slice(indexOfFirstImage, indexOfLastImage)

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(page)
        // Scroll to top of grid
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = []

        if (totalPages <= 5) {
            // If 5 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always show first page
            pageNumbers.push(1)

            // If current page is 1 or 2, show 1, 2, 3, ..., totalPages
            if (currentPage < 3) {
                pageNumbers.push(2, 3)
                pageNumbers.push("ellipsis")
            }
            // If current page is close to last page, show 1, ..., totalPages-2, totalPages-1, totalPages
            else if (currentPage > totalPages - 2) {
                pageNumbers.push("ellipsis")
                pageNumbers.push(totalPages - 2, totalPages - 1)
            }
            // Otherwise show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
            else {
                pageNumbers.push("ellipsis")
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1)
                pageNumbers.push("ellipsis")
            }

            // Always show last page
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
            },
        },
    }

    if (isLoading) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-40">
            {/* Profile Header */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`profile-header-${animationKey}`}
                    className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-xl font-semibold">{images.length}</div>
                                <div className="text-sm text-white/60">Photos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-semibold">100 ních ga</div>
                                <div className="text-sm text-white/60">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-semibold">2£</div>
                                <div className="text-sm text-white/60">Following</div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
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
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Photo Grid with Pagination */}
            <div className="space-y-6">
                {/* Grid Header */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`grid-header-${animationKey}`}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-white">Photos</h2>
                        <div className="text-sm text-white/60">
                            Showing {indexOfFirstImage + 1}-{Math.min(indexOfLastImage, images.length)} of {images.length}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Photo Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`grid-${animationKey}`}
                        className="grid grid-cols-2 gap-4 md:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {currentImages.map((image) => (
                            <motion.div
                                key={image.id}
                                layoutId={`image-${image.id}-${animationKey}`}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                                onClick={() => setSelectedImage(image)}
                                variants={itemVariants}
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
                    </motion.div>
                </AnimatePresence>

                {/* Shadcn Pagination */}
                {totalPages > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
                                </PaginationItem>
                            )}

                            {getPageNumbers().map((page, index) =>
                                page === "ellipsis" ? (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink isActive={currentPage === page} onClick={() => goToPage(page as number)}>
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ),
                            )}

                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <motion.div
                    layoutId={`image-${selectedImage.id}-${animationKey}`}
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
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

