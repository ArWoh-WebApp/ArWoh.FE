"use client"

import { motion } from "framer-motion"
import BlurText from "@/components/ui/blur-text"
import HeroImg from "@/assets/images/heroImage.png"

export default function HeroSection() {
	return (
		<section className="relative min-h-screen overflow-hidden bg-black">
			{/* Plain black background - removed gradient */}

			{/* Animated particles */}
			<div className="absolute inset-0 opacity-30">
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 rounded-full bg-purple-500"
						initial={{
							x: Math.random() * 100 + "%",
							y: Math.random() * 100 + "%",
							opacity: Math.random() * 0.5 + 0.3,
						}}
						animate={{
							y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
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

			{/* Background artwork - removed drop shadow */}
			<div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80vh]">
				<img src={HeroImg || "/placeholder.svg"} alt="3D Artwork" className="w-full h-full object-contain" />
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-[1400px] mx-auto px-6 py-24 min-h-screen flex items-center">
				<div className="max-w-2xl">
					<BlurText
						text="Transform Your Space with Stunning Artwork"
						className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
						delay={150}
						animateBy="words"
						direction="bottom"
						threshold={0.5}
						rootMargin="20px"
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="mt-8"
					>
						<p className="text-gray-300 text-lg mb-8">
							Discover unique artwork that speaks to your style and transforms your space into a personal gallery.
						</p>

						<div className="flex gap-4 mt-8">
							<motion.button
								className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-white font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								Explore Gallery
							</motion.button>
							<motion.button
								className="px-8 py-3 border border-purple-600 rounded-full text-white font-medium transition-all duration-300 hover:bg-purple-600/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								Learn More
							</motion.button>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

