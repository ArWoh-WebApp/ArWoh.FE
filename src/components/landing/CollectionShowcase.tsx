import { ThreeDCard } from "@/components/ui/3d-card"

const collectionImg =
	"https://minio.ae-tao-fullstack-api.site/api/v1/buckets/arwoh-bucket/objects/download?preview=true&prefix=landingPage%2Fjun-kim-2.jpg&version_id=null"

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

					{/* Image with 3D effect */}
					<ThreeDCard className="relative aspect-square w-full h-full">
						<div className="absolute inset-0 rounded-3xl overflow-hidden">
							<img
								src={collectionImg || "/placeholder.svg"}
								alt="Artwork Collection"
								className="w-full h-full object-contain rounded-3xl transition-transform duration-500 ease-in-out transform hover:scale-110"
							/>
						</div>
						<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-transparent pointer-events-none" />
					</ThreeDCard>
				</div>
			</div>
		</section>
	)
}

