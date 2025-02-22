"use client"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import userAvt from "@/assets/images/user.png"

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

export default function ReviewsSection() {
	return (
		<section className="bg-black text-white py-24">
			<div className="max-w-[1400px] mx-auto px-6">
				<div className="text-center space-y-4 mb-16">
					<h2 className="text-4xl md:text-5xl font-bold">Customer Reviews</h2>
					<p className="text-gray-400">Our customers love our unique artwork and designs!</p>
				</div>

				<div className="h-[400px] rounded-md flex flex-col antialiased bg-black items-center justify-center relative overflow-hidden">
					<InfiniteMovingCards items={reviews} direction="right" speed="slow" />
				</div>
			</div>
		</section>
	)
}


