"use client"

import { useState } from "react"
import { Heart, Plus, Download } from "lucide-react"
import { cn } from "@/lib/utils"

type Orientation = "all" | "landscape" | "portrait"

interface Artwork {
	id: string
	src: string
	orientation: "landscape" | "portrait"
	tags: string[]
	user: {
		name: string
		avatar: string
	}
}


// Sample data - replace with your actual data
const artworks: Artwork[] = [
	{
		id: "1",
		src: "https://images.unsplash.com/photo-1548679847-1d4ff48016c7?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "landscape",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1739624079957-917135a9c545?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "2",
		src: "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "landscape",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "3",
		src: "https://plus.unsplash.com/premium_photo-1673631128794-e9758e20e5a8?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "portrait",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "4",
		src: "https://images.unsplash.com/photo-1509943089014-50b4f4edfbbb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "landscape",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "5",
		src: "https://images.unsplash.com/photo-1502635994848-2eb3b4a38201?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "portrait",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "6",
		src: "https://images.unsplash.com/photo-1503348379917-758650634df4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "portrait",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "7",
		src: "https://images.unsplash.com/photo-1595246965570-9684145def50?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "portrait",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "8",
		src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "landscape",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "9",
		src: "https://images.unsplash.com/photo-1474767821094-a8fe9d8c8fdd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "landscape",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
	{
		id: "10",
		src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		orientation: "portrait",
		tags: ["Water Stream", "Brook", "Natural Water"],
		user: {
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1738363436272-f191888a398b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
	},
]

export default function ArtworkList() {
	const [orientation, setOrientation] = useState<Orientation>("all")

	const filteredArtworks = artworks.filter((artwork) => {
		if (orientation === "all") return true
		return artwork.orientation === orientation
	})

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
					<ArtworkCard key={artwork.id} artwork={artwork} />
				))}
			</div>
		</div>
	)
}

function ArtworkCard({ artwork }: { artwork: Artwork }) {
	return (
		<div
			className={cn(
				"relative group rounded-lg overflow-hidden",
				artwork.orientation === "portrait" ? "row-span-2" : "row-span-1",
			)}
		>
			{/* Image */}
			<img src={artwork.src || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
				{/* Top Actions */}
				<div className="absolute top-4 right-4 flex gap-2">
					<button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
						<Heart className="w-4 h-4 text-white" />
					</button>
					<button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
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

				{/* Download Button */}
				<button className="absolute bottom-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
					<Download className="w-4 h-4 text-white" />
				</button>
			</div>

			{/* Tags - Now with transition and opacity change on group hover */}
			<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-all duration-300">
				<div className="flex flex-wrap gap-2">
					{artwork.tags.map((tag) => (
						<span key={tag} className="px-2 py-1 rounded-lg bg-white/20 text-white text-xs">
							{tag}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}

