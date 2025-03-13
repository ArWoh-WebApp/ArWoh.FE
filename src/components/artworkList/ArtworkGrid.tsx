/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Plus, Share2, X, ShoppingCart, Minus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { artworkService, type ArtworkResponse } from "@/api/artwork"
import { Skeleton } from "@/components/ui/skeleton"
import { ArtworkCard } from "./ArtworkCard"
import { motion, AnimatePresence } from "framer-motion"
import { ImageSlider } from "@/components/animations/ImageSlider"

type Orientation = "all" | "landscape" | "portrait"

export default function ArtworkList() {
	const [orientation, setOrientation] = useState<Orientation>("all")
	const [selectedArtwork, setSelectedArtwork] = useState<ArtworkResponse | null>(null)
	const [quantity, setQuantity] = useState(1)
	const [artworks, setArtworks] = useState<ArtworkResponse[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { addItem, isLoading: isCartLoading } = useCart()

	useEffect(() => {
		const fetchArtworks = async () => {
			try {
				const response = await artworkService.getArtworks()
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

	const filteredArtworks = artworks.filter((artwork) => {
		if (orientation === "all") return true
		return artwork.orientation.toLowerCase() === orientation
	})

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

	// Check if there are previous/next artworks
	const currentIndex = selectedArtwork ? artworks.findIndex((a) => a.id === selectedArtwork.id) : -1
	const hasPrevious = currentIndex > 0
	const hasNext = currentIndex < artworks.length - 1 && currentIndex !== -1

	if (isLoading) {
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

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px] text-white">
				<p>{error}</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Orientation Filter */}
			<div className="flex gap-2">
				{(["all", "landscape", "portrait"] as const).map((type) => (
					<button
						key={type}
						onClick={() => setOrientation(type)}
						className={cn(
							"px-4 py-2 rounded-lg text-sm font-medium transition-colors",
							orientation === type ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/10",
						)}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				))}
			</div>

			{/* Artwork Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
				{filteredArtworks.map((artwork) => (
					<ArtworkCard key={artwork.id} artwork={artwork} onClick={() => handleArtworkClick(artwork)} />
				))}
			</div>

			{/* Artwork Detail Modal */}
			<div
				className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${selectedArtwork ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
					}`}
			>
				<div
					className={`bg-black rounded-lg w-[95vw] h-[90vh] flex items-center transform transition-transform duration-300 ${selectedArtwork ? "scale-100" : "scale-95"
						}`}
				>
					<button onClick={handleCloseDetail} className="absolute top-4 right-4 text-white z-50">
						<X />
					</button>

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
										<h2 className="text-2xl font-bold mb-4">{selectedArtwork.title}</h2>
										<div className="flex items-center justify-between mb-4">
											<p className="text-xl font-bold">{selectedArtwork.price.toLocaleString("vi-VN")} ₫</p>
										</div>
										<p className="mb-4">{selectedArtwork.description}</p>
										<p className="text-sm text-gray-400 mb-2">Location: {selectedArtwork.location}</p>
										<p className="text-sm text-gray-400 mb-4">Story: {selectedArtwork.storyOfArt}</p>
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
				</div>
			</div>
		</div>
	)
}

