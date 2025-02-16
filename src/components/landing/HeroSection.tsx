import BlurText from "@/components/ui/blur-text"

import HeroImg from "@/assets/images/heroImage.png"

export default function HeroSection() {
	return (
		<section className="relative min-h-screen bg-black overflow-hidden">
			{/* Background artwork */}
			<div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80vh]">
				<img
					src={HeroImg}
					alt="3D Artwork"
					className="w-full h-full object-contain"
				/>
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
				</div>
			</div>
		</section>
	)
}

