"use client"

import { useState } from "react"
import { Heart, Plus, ChevronLeft, ChevronRight, Share2, X, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { artworks } from "@/mock/artwork"
import type { Artwork } from "@/mock/artworkInterface"

type Orientation = "all" | "landscape" | "portrait"

export default function ArtworkList() {
	const [orientation, setOrientation] = useState<Orientation>("all")
	const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

	const filteredArtworks = artworks.filter((artwork) => {
		if (orientation === "all") return true
		return artwork.orientation === orientation
	})

	const handleArtworkClick = (artwork: Artwork) => {
		setSelectedArtwork(artwork)
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
			setTimeout(() => setSelectedArtwork(prevArtwork), 150)
		}
	}

	const handleNext = () => {
		const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork?.id)
		if (currentIndex < artworks.length - 1) {
			const nextArtwork = artworks[currentIndex + 1]
			setSelectedArtwork(null)
			setTimeout(() => setSelectedArtwork(nextArtwork), 150)
		}
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
									src={selectedArtwork.src || "/placeholder.svg"}
									alt={selectedArtwork.title}
									className={cn(
										"transition-opacity duration-300 rounded-lg",
										selectedArtwork.orientation === "portrait" ? "h-full w-auto" : "w-full h-auto max-h-full",
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
									<div className="flex items-center">
										<img
											src={selectedArtwork.user.avatar || "/placeholder.svg"}
											alt={selectedArtwork.user.name}
											className="w-10 h-10 rounded-full mr-3"
										/>
										<div>
											<p className="font-semibold">{selectedArtwork.user.name}</p>
											<p className="text-sm text-gray-400">{selectedArtwork.user.role}</p>
										</div>
									</div>
									<p className="text-xl font-bold">{selectedArtwork.price.toLocaleString("vi-VN")} ₫</p>
								</div>
								<p className="mb-4">{selectedArtwork.description}</p>
								<p className="text-sm text-gray-400 mb-2">Location: {selectedArtwork.location}</p>
								<p className="text-sm text-gray-400 mb-4">
									Uploaded: {new Date(selectedArtwork.uploadDate).toLocaleDateString()}
								</p>
								{selectedArtwork.camera && (
									<div className="mb-4">
										<p className="text-sm text-gray-400">Camera: {selectedArtwork.camera.model}</p>
										<p className="text-sm text-gray-400">Settings: {selectedArtwork.camera.settings}</p>
									</div>
								)}
								<div className="flex flex-wrap gap-2 mb-4">
									{selectedArtwork.tags.map((tag) => (
										<span key={tag} className="px-2 py-1 bg-gray-800 rounded-full text-xs">
											{tag}
										</span>
									))}
								</div>
								<div className="flex items-center gap-4 mt-6">
									<button className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
										<ShoppingCart size={16} />
										Add to Cart
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

function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"relative group rounded-lg overflow-hidden cursor-pointer",
				artwork.orientation === "portrait" ? "row-span-2" : "row-span-1",
			)}
		>
			{/* Image */}
			<img src={artwork.src || "/placeholder.svg"} alt={artwork.title} className="w-full h-full object-cover" />

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

				{/* User Info */}
				<div className="absolute bottom-4 left-4 flex items-center gap-2">
					<img
						src={artwork.user.avatar || "/placeholder.svg"}
						alt={artwork.user.name}
						className="w-8 h-8 rounded-full"
					/>
					<span className="text-white text-sm font-medium">{artwork.user.name}</span>
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

