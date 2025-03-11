"use client"

import { motion } from "framer-motion"
import { ThreeDCard } from "@/components/ui/3d-card"
import { ArrowRight } from "lucide-react"

// const collectionImg =
// 	"https://minio.ae-tao-fullstack-api.site/api/v1/buckets/arwoh-bucket/objects/download?preview=true&prefix=landingPage%2Fjun-kim-2.jpg&version_id=null"

const collectionImg = "https://minio.ae-tao-fullstack-api.site/api/v1/buckets/arwoh-bucket/objects/download?preview=true&prefix=landingPage%2FUntitled.png&version_id=null"
export default function CollectionShowcase() {
	return (
		<section className="py-24 relative overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-black/90"></div>

			{/* Animated particles */}
			<div className="absolute inset-0 opacity-20">
				{Array.from({ length: 15 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 rounded-full bg-purple-500"
						initial={{
							x: Math.random() * 100 + "%",
							y: Math.random() * 100 + "%",
							opacity: Math.random() * 0.5 + 0.3,
						}}
						animate={{
							x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
							opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.2 + 0.1],
						}}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							duration: Math.random() * 10 + 20,
							repeatType: "reverse",
						}}
						style={{
							width: Math.random() * 3 + 1 + "px",
							height: Math.random() * 3 + 1 + "px",
						}}
					/>
				))}
			</div>

			<div className="max-w-[1400px] mx-auto px-6 relative z-10">
				<div className="grid md:grid-cols-2 gap-12 items-center">
					{/* Text Content */}
					<motion.div
						className="space-y-6"
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true, margin: "-100px" }}
					>
						<motion.p
							className="text-sm text-purple-400"
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							viewport={{ once: true }}
						>
							Explore
						</motion.p>
						<motion.h2
							className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Discover Our Diverse Artwork Collection
						</motion.h2>
						<motion.p
							className="text-gray-400"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							viewport={{ once: true }}
						>
							From stunning postcards to vibrant sticker packs and eye-catching posters, our collection has something
							for everyone. Experience the joy of creativity and find the perfect piece to express yourself.
						</motion.p>
						<motion.div
							className="flex gap-4"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							viewport={{ once: true }}
						>
							<motion.button
								className="px-6 py-2 bg-transparent border border-purple-600 rounded-full text-white hover:bg-purple-600/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								Shop
							</motion.button>
							<motion.button
								className="px-6 py-2 text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-1 group"
								whileHover={{ x: 5 }}
								whileTap={{ scale: 0.98 }}
							>
								View
								<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
							</motion.button>
						</motion.div>
					</motion.div>

					{/* Image with 3D effect */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
						viewport={{ once: true, margin: "-100px" }}
					>
						<ThreeDCard className="relative aspect-square w-full h-full">
							<div className="absolute inset-0 rounded-3xl overflow-hidden">
								<motion.img
									src={collectionImg || "/placeholder.svg"}
									alt="Artwork Collection"
									className="w-full h-full object-fit rounded-3xl"
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.5 }}
								/>
							</div>
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-transparent pointer-events-none" />

							{/* Floating badges */}
							<motion.div
								className="absolute -top-5 -right-5 bg-gradient-to-br from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.6, duration: 0.5 }}
								viewport={{ once: true }}
								whileHover={{ y: -5, scale: 1.05 }}
							>
								New Collection
							</motion.div>

							<motion.div
								className="absolute -bottom-5 -left-5 bg-white text-purple-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
								initial={{ y: -20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.8, duration: 0.5 }}
								viewport={{ once: true }}
								whileHover={{ y: 5, scale: 1.05 }}
							>
								Limited Edition
							</motion.div>
						</ThreeDCard>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

