"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, MapPin, Loader2, X, Edit, Trash2, ChevronLeft, ChevronRight, Upload, Plus } from "lucide-react"
import { photographerService } from "@/api/photographer"
import type { UserService } from "@/api/user"
import type { PhotographerImage, UpdateImageRequest, UploadImageRequest } from "@/api/photographer"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/richText/RichTextEditor"
import { RichTextContent } from "@/components/richText/RichTextContent"

export function PhotographerProfile() {
    const [profile, setProfile] = useState<UserService.User | null>(null)
    const [images, setImages] = useState<PhotographerImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<PhotographerImage | null>(null)
    const [animationKey, setAnimationKey] = useState(0) // Key to force animation reset
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form states for upload/edit
    const [formData, setFormData] = useState<{
        title: string
        description: string
        price: string
        location: string
        orientation: "Portrait" | "Landscape"
        tags: string
        storyOfArt: string
        file?: File
    }>({
        title: "",
        description: "",
        price: "",
        location: "",
        orientation: "Portrait",
        tags: "",
        storyOfArt: "",
    })

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const imagesPerPage = 6 // Show 6 images per page (2 rows of 3 on desktop)

    // Reset animation when tab changes
    useEffect(() => {
        // This will trigger a re-render and reset animations
        setAnimationKey((prev) => prev + 1)
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [profileRes, imagesRes] = await Promise.all([
                photographerService.getPhotographerProfile(),
                photographerService.getCurrentPhotographerImages(), // Hardcoded ID for now
            ])

            if (profileRes.isSuccess) {
                setProfile(profileRes.data)
            }
            if (imagesRes.isSuccess) {
                setImages(imagesRes.data)
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

    const handleViewImage = async (image: PhotographerImage, index: number) => {
        setIsImageLoading(true)
        setCurrentImageIndex(index)

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

    const handleDeleteImage = async () => {
        if (!selectedImage) return

        try {
            const response = await photographerService.deleteImage(selectedImage.id)
            if (response.isSuccess) {
                toast.success("Image deleted successfully")
                setImages(images.filter((img) => img.id !== selectedImage.id))
                setSelectedImage(null)
                setIsDeleteDialogOpen(false)
            } else {
                toast.error(response.message || "Failed to delete image")
            }
        } catch (error) {
            console.error("Error deleting image:", error)
            toast.error("An error occurred while deleting the image")
        }
    }

    const handleEditClick = () => {
        if (!selectedImage) return

        setFormData({
            title: selectedImage.title,
            description: selectedImage.description,
            price: selectedImage.price.toString(),
            location: selectedImage.location || "",
            orientation: (selectedImage.orientation as "Portrait" | "Landscape") || "Portrait",
            tags: selectedImage.tags.join(", "),
            storyOfArt: selectedImage.storyOfArt || "",
        })

        setIsEditDialogOpen(true)
    }

    const handleUpdateImage = async () => {
        if (!selectedImage) return

        try {
            const updateData: UpdateImageRequest = {
                title: formData.title,
                description: formData.description,
                price: Number.parseFloat(formData.price),
                location: formData.location,
                orientation: formData.orientation,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                storyOfArt: formData.storyOfArt,
                fileName: selectedImage.fileName || "",
                url: selectedImage.url,
            }

            const response = await photographerService.updateImage(selectedImage.id, updateData)
            if (response.isSuccess) {
                toast.success("Image updated successfully")

                // Update the images array with the updated image
                setImages(images.map((img) => (img.id === selectedImage.id ? response.data : img)))

                // Update the selected image
                setSelectedImage(response.data)
                setIsEditDialogOpen(false)
            } else {
                toast.error(response.message || "Failed to update image")
            }
        } catch (error) {
            console.error("Error updating image:", error)
            toast.error("An error occurred while updating the image")
        }
    }

    const handleUploadClick = () => {
        setFormData({
            title: "",
            description: "",
            price: "",
            location: "",
            orientation: "Portrait",
            tags: "",
            storyOfArt: "",
        })
        setIsUploadDialogOpen(true)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                file: e.target.files[0],
            })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleRichTextChange = (value: string) => {
        setFormData({
            ...formData,
            storyOfArt: value,
        })
    }

    const handleUploadImage = async () => {
        if (!formData.file) {
            toast.error("Please select an image file")
            return
        }

        try {
            const uploadData: UploadImageRequest = {
                title: formData.title,
                description: formData.description,
                price: Number.parseFloat(formData.price),
                location: formData.location,
                orientation: formData.orientation,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                storyOfArt: formData.storyOfArt,
                file: formData.file,
            }

            const response = await photographerService.uploadImage(uploadData)
            if (response.isSuccess) {
                toast.success("Image uploaded successfully")

                // Add the new image to the images array
                setImages([...images, response.data])
                setIsUploadDialogOpen(false)

                // Reset form data
                setFormData({
                    title: "",
                    description: "",
                    price: "",
                    location: "",
                    orientation: "Portrait",
                    tags: "",
                    storyOfArt: "",
                })

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            } else {
                toast.error(response.message || "Failed to upload image")
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            toast.error("An error occurred while uploading the image")
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
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-white/60">
                                Showing {indexOfFirstImage + 1}-{Math.min(indexOfLastImage, images.length)} of {images.length}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 border-purple-500"
                                onClick={handleUploadClick}
                            >
                                <Upload className="h-4 w-4" />
                                Upload
                            </Button>
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
                                            <div className="flex gap-2">
                                                <button
                                                    className="rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditClick()
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="rounded-full bg-red-500/20 p-2 text-red-400 transition-colors hover:bg-red-500/30 hover:text-red-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
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
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-black/95 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete Image</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to delete this image? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteImage} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Image Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-4xl bg-black/95 border-white/10 max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-white">Edit Image</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Update the details of your image. Rich text formatting is available for the Story field.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[65vh] pr-4">
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-white/80">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-white/80">
                                        Price (₫)
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-white/80">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-white/80">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="orientation" className="text-white/80">
                                        Orientation
                                    </Label>
                                    <select
                                        id="orientation"
                                        name="orientation"
                                        value={formData.orientation}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="Portrait">Portrait</option>
                                        <option value="Landscape">Landscape</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-white/80">
                                    Tags (comma separated)
                                </Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                    placeholder="nature, landscape, mountains"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storyOfArt" className="text-white/80 flex items-center gap-2">
                                    Story
                                    <span className="text-xs text-purple-400">(Rich text formatting available)</span>
                                </Label>
                                <RichTextEditor
                                    value={formData.storyOfArt}
                                    onChange={handleRichTextChange}
                                    placeholder="Tell the story behind this image"
                                />
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateImage} className="bg-purple-600 text-white hover:bg-purple-700">
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upload Image Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="sm:max-w-6xl bg-black/95 border-white/10 max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-white">Upload New Image</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Add a new image to your portfolio. Rich text formatting is available for the Story field.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col md:flex-row gap-6 mt-4 h-[70vh]">
                        {/* Left side - File Upload Area */}
                        <div className="md:w-2/5 flex-shrink-0 h-full">
                            <div
                                className={`relative border-2 border-dashed ${formData.file ? "border-purple-500" : "border-purple-500/30"} rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors h-full`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {formData.file ? (
                                    <div className="w-full flex flex-col items-center">
                                        <div className="relative w-full h-[400px] mb-4 overflow-hidden rounded-lg border border-white/20">
                                            <img
                                                src={URL.createObjectURL(formData.file) || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-sm text-white/80 truncate max-w-full">{formData.file.name}</p>
                                        <button
                                            type="button"
                                            className="mt-2 text-xs text-purple-400 hover:text-purple-300"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setFormData({ ...formData, file: undefined })
                                                if (fileInputRef.current) fileInputRef.current.value = ""
                                            }}
                                        >
                                            Change image
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <Plus className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <p className="text-gray-400 text-base font-medium">Click to upload image</p>
                                        <p className="text-white/40 text-sm mt-2 text-center">PNG, JPG or WEBP (max. 10MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right side - Form Fields */}
                        <div className="md:w-3/5 h-full">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-6 pb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="upload-title" className="text-white/80">
                                            Title
                                        </Label>
                                        <Input
                                            id="upload-title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                            placeholder="Enter title"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="upload-price" className="text-white/80">
                                            Price (₫)
                                        </Label>
                                        <Input
                                            id="upload-price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                            placeholder="Enter price"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="upload-description" className="text-white/80">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="upload-description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                            placeholder="Describe your image"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="upload-location" className="text-white/80">
                                                Location
                                            </Label>
                                            <Input
                                                id="upload-location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                                placeholder="Where was it taken?"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="upload-orientation" className="text-white/80">
                                                Orientation
                                            </Label>
                                            <select
                                                id="upload-orientation"
                                                name="orientation"
                                                value={formData.orientation}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="Portrait">Portrait</option>
                                                <option value="Landscape">Landscape</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="upload-tags" className="text-white/80">
                                            Tags (comma separated)
                                        </Label>
                                        <Input
                                            id="upload-tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500"
                                            placeholder="nature, landscape, mountains"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="upload-storyOfArt" className="text-white/80 flex items-center gap-2">
                                            Story
                                            <span className="text-xs text-purple-400">(Rich text formatting available)</span>
                                        </Label>
                                        <RichTextEditor
                                            value={formData.storyOfArt}
                                            onChange={handleRichTextChange}
                                            placeholder="Tell the story behind this image"
                                        />
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadDialogOpen(false)}
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadImage}
                            className="bg-purple-600 text-white hover:bg-purple-700"
                            disabled={!formData.file || !formData.title || !formData.price}
                        >
                            Upload Image
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

