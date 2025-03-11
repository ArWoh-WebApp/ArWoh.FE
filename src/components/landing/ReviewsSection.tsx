"use client"
import { motion } from "framer-motion"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import userAvt from "@/assets/images/user.png"
import { Star } from "lucide-react"

const reviews = [
	{
		rating: 5,
		text: "The quality of the postcards exceeded my expectations!",
		author: "Emily Johnson",
		role: "Designer, Art Co.",
		avatar: userAvt,
	},
	{
		rating: 4,
		text: "The 3D mockup feature helped me choose perfectly!",
		author: "Michael Smith",
		role: "Manager, Creative Hub",
		avatar: userAvt,
	},
	{
		rating: 5,
		text: "I love the variety and creativity in their products!",
		author: "Sarah Lee",
		role: "Owner, Print Shop",
		avatar: userAvt,
	},
	{
		rating: 5,
		text: "ArWoh's artwork transformed my living space completely!",
		author: "Alex Chen",
		role: "Interior Designer",
		avatar: userAvt,
	},
	{
		rating: 4,
		text: "Great customer service and quick delivery. Will order again!",
		author: "Jessica Brown",
		role: "Art Enthusiast",
		avatar: userAvt,
	},
	{
		rating: 5,
		text: "The customization options are fantastic. Got exactly what I wanted!",
		author: "David Wilson",
		role: "Corporate Client",
		avatar: userAvt,
	},
	{
		rating: 5,
		text: "ArWoh's designs are truly unique. A great conversation starter!",
		author: "Emma Thompson",
		role: "Cafe Owner",
		avatar: userAvt,
	},
	{
		rating: 4,
		text: "Impressive quality and attention to detail in every piece.",
		author: "Ryan Garcia",
		role: "Photographer",
		avatar: userAvt,
	},
]

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
	return (
		<div className="flex">
			{[...Array(5)].map((_, i) => (
				<Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
			))}
		</div>
	)
}

export default function ReviewsSection() {
	return (
		<section className="py-24 relative overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>

			{/* Animated glow */}
			<motion.div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] opacity-50"
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
				}}
			/>

			<div className="max-w-[1400px] mx-auto px-6 relative z-10">
				<motion.div
					className="text-center space-y-4 mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true, margin: "-100px" }}
				>
					<motion.h2
						className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						Customer Reviews
					</motion.h2>
					<motion.p
						className="text-gray-400"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
					>
						Our customers love our unique artwork and designs!
					</motion.p>
				</motion.div>

				<motion.div
					className="h-[400px] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.7, delay: 0.2 }}
					viewport={{ once: true, margin: "-100px" }}
				>
					<InfiniteMovingCards
						items={reviews.map((review) => ({
							...review,
							content: (
								<div className="group relative h-full w-full p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300">
									<StarRating rating={review.rating} />
									<p className="mt-4 text-sm leading-normal text-white/80 font-medium">"{review.text}"</p>
									<div className="mt-4 flex items-center gap-3">
										<img
											src={review.avatar || "/placeholder.svg"}
											alt={review.author}
											className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
										/>
										<div>
											<h3 className="text-sm font-semibold text-white">{review.author}</h3>
											<p className="text-xs text-white/60">{review.role}</p>
										</div>
									</div>
									<div className="absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-tr from-transparent to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
							),
						}))}
						direction="right"
						speed="slow"
					/>
				</motion.div>

				<motion.div
					className="mt-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<motion.button
						className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-white font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
					>
						Read All Reviews
					</motion.button>
				</motion.div>
			</div>
		</section>
	)
}

