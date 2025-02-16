import collectionImg from "@/assets/images/collectionSection.png"

export default function CollectionShowcase() {
	return (
		<section className="bg-black text-white py-24">
			<div className="max-w-[1400px] mx-auto px-6">
				<div className="grid md:grid-cols-2 gap-12 items-center">
					{/* Text Content */}
					<div className="space-y-6">
						<p className="text-sm">Explore</p>
						<h2 className="text-4xl md:text-5xl font-bold">Discover Our Diverse Artwork Collection</h2>
						<p className="text-gray-400">
							From stunning postcards to vibrant sticker packs and eye-catching posters, our collection has something
							for everyone. Experience the joy of creativity and find the perfect piece to express yourself.
						</p>
						<div className="flex gap-4">
							<button className="px-6 py-2 bg-transparent border border-purple-600 rounded-full text-white hover:bg-purple-600/10 transition-colors">
								Shop
							</button>
							<button className="px-6 py-2 text-purple-600 hover:text-purple-500 transition-colors">View →</button>
						</div>
					</div>

					{/* Image */}
					<div className="relative aspect-square">
						<div className="absolute inset-0 rounded-3xl">
							<img
								src={collectionImg}
								alt="Artwork Collection"
								className="w-full h-full object-contain rounded-3xl"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

