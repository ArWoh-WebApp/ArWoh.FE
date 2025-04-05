/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, MapPin, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { photographerService } from "@/api/photographer"
import type { PhotographerImage, PhotographerProfile } from "@/api/photographer"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { RichTextContent } from "@/components/richText/RichTextContent"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"

interface PublicPhotographerProfileProps {
    photographerId: number
}

export function PublicPhotographerProfile({ photographerId }: PublicPhotographerProfileProps) {
    const [profile, setProfile] = useState<PhotographerProfile | null>(null)
    const [images, setImages] = useState<PhotographerImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<PhotographerImage | null>(null)
    const [animationKey, setAnimationKey] = useState(0)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const { addItem, isLoading: isCartLoading } = useCart()
    const [quantity, setQuantity] = useState(1)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const imagesPerPage = 6 // Show 6 images per page (2 rows of 3 on desktop)

    // Reset animation when component mounts
    useEffect(() => {
        setAnimationKey((prev) => prev + 1)
    }, [photographerId])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [profileRes, imagesRes] = await Promise.all([
                photographerService.getPhotographerProfileById(photographerId),
                photographerService.getPhotographerImages(photographerId),
            ])

            if (profileRes.isSuccess) {
                setProfile(profileRes.data)
            } else {
                toast.error(profileRes.message || "Failed to load photographer profile")
            }

            if (imagesRes.isSuccess) {
                setImages(imagesRes.data)
            } else {
                toast.error(imagesRes.message || "Failed to load photographer images")
            }
        } catch (error) {
            console.error("Failed to fetch photographer data:", error)
            toast.error("Failed to load profile data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [photographerId])

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

    const handleViewImage = async (image: PhotographerImage, index: number) => {
        setIsImageLoading(true)
        setCurrentImageIndex(index)
        setQuantity(1)

        try {
            // Fetch detailed image data
            const response = await photographerService.getImageById(image.id)
            if (response.isSuccess) {
                setSelectedImage(response.data)
            } else {
                // If the detailed fetch fails, use the grid data
                setSelectedImage(image)
                toast.error("Could not load full image details")
            }
        } catch (error) {
            console.error("Failed to fetch image details:", error)
            setSelectedImage(image)
            toast.error("Could not load full image details")
        } finally {
            setIsImageLoading(false)
        }
    }

    const handleCloseModal = () => {
        setSelectedImage(null)
    }

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            const prevIndex = currentImageIndex - 1
            handleViewImage(currentImages[prevIndex], prevIndex)
        }
    }

    const handleNextImage = () => {
        if (currentImageIndex < currentImages.length - 1) {
            const nextIndex = currentImageIndex + 1
            handleViewImage(currentImages[nextIndex], nextIndex)
        }
    }

    const handleAddToCart = () => {
        if (selectedImage) {
            addItem(selectedImage.id, quantity)
        }
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

    if (!profile) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <p className="text-white/60">Photographer not found</p>
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
                                src={profile.profilePictureUrl || "/placeholder.svg"}
                                alt={profile.username}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                            <h1 className="text-2xl font-semibold">{profile.username}</h1>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-xl font-semibold">{images.length}</div>
                                <div className="text-sm text-white/60">Photos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-semibold">100</div>
                                <div className="text-sm text-white/60">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-semibold">2</div>
                                <div className="text-sm text-white/60">Following</div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <div className="text-sm text-white/60">{profile.bio || "No bio yet"}</div>
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
                        {currentImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                                onClick={() => handleViewImage(image, index)}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="absolute bottom-0 w-full p-4">
                                        <h3 className="text-sm font-medium text-white">{image.title}</h3>
                                        <p className="mt-1 text-xs text-white/80">{image.price.toLocaleString("vi-VN")} ₫</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty state */}
                {images.length === 0 && (
                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-white/10 bg-white/5">
                        <p className="text-white/60">No photos available</p>
                    </div>
                )}

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
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    >
                        {/* Close button */}
                        <button
                            className="absolute right-6 top-6 z-50 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                            onClick={handleCloseModal}
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Navigation buttons */}
                        <button
                            className={cn(
                                "absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white/80 transition-colors hover:bg-black/70 hover:text-white",
                                currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100",
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                handlePrevImage()
                            }}
                            disabled={currentImageIndex === 0}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <button
                            className={cn(
                                "absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white/80 transition-colors hover:bg-black/70 hover:text-white",
                                currentImageIndex === currentImages.length - 1 ? "opacity-50 cursor-not-allowed" : "opacity-100",
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleNextImage()
                            }}
                            disabled={currentImageIndex === currentImages.length - 1}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Image container */}
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-xl bg-black/30 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isImageLoading ? (
                                <div className="flex h-[50vh] w-full min-w-[300px] items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="relative flex h-[50vh] w-full items-center justify-center overflow-hidden md:h-[70vh] md:w-2/3">
                                        <img
                                            src={selectedImage.url || "/placeholder.svg"}
                                            alt={selectedImage.title}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    {/* Details sidebar */}
                                    <div className="w-full border-t border-white/10 p-6 md:w-1/3 md:border-l md:border-t-0">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-xl font-semibold text-white">{selectedImage.title}</h3>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-white/60">Price</h4>
                                                <p className="text-lg font-semibold text-white">
                                                    {selectedImage.price.toLocaleString("vi-VN")} ₫
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-white/60">Description</h4>
                                                <p className="text-sm text-white/80">{selectedImage.description}</p>
                                            </div>

                                            {selectedImage.storyOfArt && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-white/60">Story</h4>
                                                    <RichTextContent
                                                        html={selectedImage.storyOfArt}
                                                        className="text-sm text-white/80 mt-2 max-h-[200px] overflow-y-auto pr-2"
                                                    />
                                                </div>
                                            )}

                                            {selectedImage.location && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-white/60">Location</h4>
                                                    <p className="text-sm text-white/80">{selectedImage.location}</p>
                                                </div>
                                            )}

                                            {selectedImage.orientation && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-white/60">Orientation</h4>
                                                    <p className="text-sm text-white/80">{selectedImage.orientation}</p>
                                                </div>
                                            )}

                                            {selectedImage.tags && selectedImage.tags.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-white/60">Tags</h4>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {selectedImage.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Add to cart button */}
                                            <div className="mt-6">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleAddToCart()
                                                    }}
                                                    className="w-full bg-white text-black hover:bg-gray-100"
                                                    disabled={isCartLoading}
                                                >
                                                    {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

