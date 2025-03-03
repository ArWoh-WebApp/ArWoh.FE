/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Heart, Plus, ChevronLeft, ChevronRight, Share2, X, ShoppingCart, Minus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { artworkService, type ArtworkResponse } from "@/api/artwork"

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
		const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork?.id)
		if (currentIndex > 0) {
			const prevArtwork = artworks[currentIndex - 1]
			setSelectedArtwork(null)
			setTimeout(() => {
				setSelectedArtwork(prevArtwork)
				setQuantity(1)
			}, 150)
		}
	}

	const handleNext = () => {
		const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork?.id)
		if (currentIndex < artworks.length - 1) {
			const nextArtwork = artworks[currentIndex + 1]
			setSelectedArtwork(null)
			setTimeout(() => {
				setSelectedArtwork(nextArtwork)
				setQuantity(1)
			}, 150)
		}
	}

	const handleAddToCart = async () => {
		if (selectedArtwork) {
			await addItem(selectedArtwork.id.toString(), quantity)
			handleCloseDetail()
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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
					<button onClick={handleCloseDetail} className="absolute top-4 right-4 text-white">
						<X />
					</button>
					{selectedArtwork && (
						<div className="flex flex-col md:flex-row h-full w-full p-4 gap-8">
							<div className="md:w-2/3 relative h-full flex items-center justify-center">
								<img
									src={selectedArtwork.url || "/placeholder.svg"}
									alt={selectedArtwork.title}
									className={cn(
										"transition-opacity duration-300 rounded-lg",
										selectedArtwork.orientation.toLowerCase() === "portrait"
											? "h-full w-auto"
											: "w-full h-auto max-h-full",
									)}
									key={selectedArtwork.id}
								/>
								<button
									onClick={handlePrevious}
									className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full transition-transform duration-300 hover:scale-110"
								>
									<ChevronLeft className="text-white" />
								</button>
								<button
									onClick={handleNext}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full transition-transform duration-300 hover:scale-110"
								>
									<ChevronRight className="text-white" />
								</button>
							</div>
							<div className="md:w-1/3 h-full overflow-y-auto text-white pr-4">
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
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function ArtworkCard({ artwork, onClick }: { artwork: ArtworkResponse; onClick: () => void }) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"relative group rounded-lg overflow-hidden cursor-pointer",
				artwork.orientation.toLowerCase() === "portrait" ? "row-span-2" : "row-span-1",
			)}
		>
			{/* Image */}
			<img src={artwork.url || "/placeholder.svg"} alt={artwork.title} className="w-full h-full object-cover" />

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
			<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-all duration-300">
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

