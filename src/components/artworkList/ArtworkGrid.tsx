/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Share2, X, ShoppingCart, Minus, Loader2, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { artworkService, type ArtworkResponse, type ArtworkParams } from "@/api/artwork"
import { Skeleton } from "@/components/ui/skeleton"
import { ArtworkCard } from "./ArtworkCard"
import { motion, AnimatePresence } from "framer-motion"
import { ImageSlider } from "@/components/animations/ImageSlider"
import { useNavigate } from "react-router-dom"
import { RichTextContent } from "@/components/richText/RichTextContent"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

type Orientation = "all" | "landscape" | "portrait"

export default function ArtworkList() {
	const [orientation, setOrientation] = useState<Orientation>("all")
	const [selectedArtwork, setSelectedArtwork] = useState<ArtworkResponse | null>(null)
	const [quantity, setQuantity] = useState(1)
	const [artworks, setArtworks] = useState<ArtworkResponse[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { addItem, isLoading: isCartLoading } = useCart()
	const navigate = useNavigate()

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [pageSize] = useState(9) // Fixed page size of 9 items

	const fetchArtworks = useCallback(async () => {
		try {
			setIsLoading(true)

			// Prepare API parameters
			const params: ArtworkParams = {
				pageIndex: currentPage,
				pageSize: pageSize,
			}

			// Only add orientation filter if not "all"
			if (orientation !== "all") {
				params.orientation = orientation
			}

			const response = await artworkService.getArtworks(params)

			if (response.isSuccess) {
				setArtworks(response.data)

				// Estimate total pages based on the number of items returned
				// In a real app, the API should return total count information
				if (response.data.length < pageSize) {
					setTotalPages(currentPage)
				} else {
					setTotalPages(Math.max(totalPages, currentPage + 1))
				}
			} else {
				setError(response.message)
			}
		} catch (err) {
			setError("Failed to load artworks")
		} finally {
			setIsLoading(false)
		}
	}, [currentPage, orientation, pageSize, totalPages])

	// Fetch artworks when page or orientation changes
	useEffect(() => {
		fetchArtworks()
	}, [fetchArtworks, currentPage, orientation])

	const handleArtworkClick = (artwork: ArtworkResponse) => {
		setSelectedArtwork(artwork)
		setQuantity(1)
		document.body.style.overflow = "hidden"
	}

	const handleCloseDetail = () => {
		setSelectedArtwork(null)
		document.body.style.overflow = "auto"
	}

	const handlePrevious = () => {
		if (!selectedArtwork) return

		const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork.id)
		if (currentIndex > 0) {
			const prevArtwork = artworks[currentIndex - 1]
			setSelectedArtwork(prevArtwork)
			setQuantity(1)
		}
	}

	const handleNext = () => {
		if (!selectedArtwork) return

		const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork.id)
		if (currentIndex < artworks.length - 1) {
			const nextArtwork = artworks[currentIndex + 1]
			setSelectedArtwork(nextArtwork)
			setQuantity(1)
		}
	}

	const handleAddToCart = () => {
		if (selectedArtwork) {
			addItem(selectedArtwork.id, quantity)
			handleCloseDetail()
		}
	}

	const handleViewPhotographer = (photographerId: number) => {
		navigate(`/photographer/${photographerId}`)
	}

	const handleOrientationChange = (newOrientation: Orientation) => {
		if (newOrientation !== orientation) {
			setOrientation(newOrientation)
			setCurrentPage(1) // Reset to first page when changing orientation
			setTotalPages(1) // Reset total pages estimate
		}
	}

	// Handle page change
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

	// Check if there are previous/next artworks
	const currentIndex = selectedArtwork ? artworks.findIndex((a) => a.id === selectedArtwork.id) : -1
	const hasPrevious = currentIndex > 0
	const hasNext = currentIndex < artworks.length - 1 && currentIndex !== -1

	if (isLoading && artworks.length === 0) {
		return (
			<div className="space-y-6">
				{/* Skeleton for Orientation Filter */}
				<div className="flex gap-2">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-10 w-24" />
					))}
				</div>

				{/* Skeleton for Artwork Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
					{Array.from({ length: 9 }).map((_, index) => (
						<Skeleton
							key={index}
							className={cn("w-full h-full rounded-lg", index % 3 === 0 ? "row-span-2" : "row-span-1")}
						/>
					))}
				</div>
			</div>
		)
	}

	if (error && artworks.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-[400px] text-white">
				<p>{error}</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Orientation Filter */}
			<motion.div
				className="flex gap-2"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				{(["all", "landscape", "portrait"] as const).map((type) => (
					<button
						key={type}
						onClick={() => handleOrientationChange(type)}
						className={cn(
							"px-4 py-2 rounded-lg text-sm font-medium transition-colors",
							orientation === type ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/10",
						)}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				))}
			</motion.div>

			{/* Artwork Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
				{artworks.map((artwork) => (
					<ArtworkCard key={artwork.id} artwork={artwork} onClick={() => handleArtworkClick(artwork)} />
				))}
			</div>

			{/* Empty state */}
			{artworks.length === 0 && !isLoading && (
				<div className="flex flex-col items-center justify-center py-12 text-white/60">
					<p className="text-lg">No artworks found</p>
					<p className="text-sm mt-2">Try changing your filter or check back later</p>
				</div>
			)}

			{/* Loading indicator */}
			{isLoading && artworks.length > 0 && (
				<div className="flex justify-center py-4">
					<Loader2 className="h-8 w-8 animate-spin text-purple-600" />
				</div>
			)}

			{/* Pagination */}
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

			{/* Artwork Detail Modal */}
			<AnimatePresence>
				{selectedArtwork && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
						onClick={handleCloseDetail}
					>
						<motion.div
							initial={{ scale: 0.9 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.9 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
							className="bg-black rounded-lg w-[95vw] h-[90vh] flex items-center"
							onClick={(e) => e.stopPropagation()}
						>
							<button onClick={handleCloseDetail} className="absolute top-4 right-4 text-white z-50">
								<X />
							</button>

							{/* Navigation buttons */}

							{selectedArtwork && (
								<div className="flex flex-col md:flex-row h-full w-full p-4 gap-8">
									<div className="md:w-2/3 relative h-full flex items-center justify-center overflow-hidden">
										{/* Image Slider */}
										<ImageSlider
											artwork={selectedArtwork}
											onPrevious={handlePrevious}
											onNext={handleNext}
											hasPrevious={hasPrevious}
											hasNext={hasNext}
										/>
									</div>

									{/* Artwork Details */}
									<div className="md:w-1/3 h-full overflow-y-auto text-white pr-4">
										<AnimatePresence mode="wait">
											<motion.div
												key={selectedArtwork.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												transition={{ duration: 0.3 }}
											>
												{/* Photographer Info - Improved Section */}
												{selectedArtwork.photographerId && (
													<div className="mb-6">
														<h4 className="text-sm font-medium text-white/60 mb-2">Photographer</h4>
														<div
															className="flex items-center gap-3 p-2 rounded-lg border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
															onClick={() => handleViewPhotographer(selectedArtwork.photographerId)}
														>
															<Avatar className="h-10 w-10 border border-white/20">
																<AvatarImage
																	src={selectedArtwork.photographerAvatar || "/placeholder.svg"}
																	alt={selectedArtwork.photographerName || "Photographer"}
																/>
																<AvatarFallback className="bg-purple-900/50">
																	<User className="h-5 w-5" />
																</AvatarFallback>
															</Avatar>
															<div className="flex-1">
																<h3 className="font-medium text-white text-sm">{selectedArtwork.photographerName}</h3>
																<p className="text-xs text-white/60">{selectedArtwork.photographerEmail}</p>
															</div>
															<div className="text-xs text-purple-400">View profile</div>
														</div>
													</div>
												)}

												<h2 className="text-2xl font-bold mb-4">{selectedArtwork.title}</h2>
												<div className="flex items-center justify-between mb-4">
													<p className="text-xl font-bold">{selectedArtwork.price.toLocaleString("vi-VN")} ₫</p>
												</div>
												<p className="mb-4">{selectedArtwork.description}</p>
												<p className="text-sm text-gray-400 mb-2">Location: {selectedArtwork.location}</p>

												{/* Story of Art - Updated to use RichTextContent */}
												<div className="mb-4">
													<h4 className="text-sm font-medium text-white/60 mb-1">Story:</h4>
													{selectedArtwork.storyOfArt && selectedArtwork.storyOfArt.startsWith("<") ? (
														<RichTextContent
															html={selectedArtwork.storyOfArt}
															className="text-sm text-white/80 max-h-[150px] overflow-y-auto pr-2"
														/>
													) : (
														<p className="text-sm text-white/80">{selectedArtwork.storyOfArt}</p>
													)}
												</div>

												<div className="flex flex-wrap gap-2 mb-4">
													{selectedArtwork.tags.map((tag) => (
														<span key={tag} className="px-2 py-1 bg-gray-800 rounded-full text-xs">
															{tag}
														</span>
													))}
												</div>
												<div className="flex items-center gap-4 mt-6">
													<div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
														<button
															onClick={() => setQuantity(Math.max(1, quantity - 1))}
															className="p-1 rounded-full hover:bg-white/10 transition-colors"
															disabled={isCartLoading}
														>
															<Minus className="w-4 h-4 text-white" />
														</button>
														<span className="text-white min-w-[2rem] text-center">{quantity}</span>
														<button
															onClick={() => setQuantity(quantity + 1)}
															className="p-1 rounded-full hover:bg-white/10 transition-colors"
															disabled={isCartLoading}
														>
															<Plus className="w-4 h-4 text-white" />
														</button>
													</div>
													<button
														className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
														onClick={handleAddToCart}
														disabled={isCartLoading}
													>
														{isCartLoading ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<>
																<ShoppingCart size={16} />
																Add to Cart
															</>
														)}
													</button>
													<button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
														<Share2 size={16} />
														Share
													</button>
												</div>
											</motion.div>
										</AnimatePresence>
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
