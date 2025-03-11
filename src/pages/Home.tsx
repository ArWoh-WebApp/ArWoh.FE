import HeroSection from "@/components/landing/HeroSection"
import FeaturesSection from "@/components/landing/FeatureSection"
import CollectionShowcase from "@/components/landing/CollectionShowcase"
import ReviewsSection from "@/components/landing/ReviewsSection"

export default function LandingPage() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950">
			<div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
			<HeroSection />
			<FeaturesSection />
			<CollectionShowcase />
			<ReviewsSection />
		</main>
	)
}

