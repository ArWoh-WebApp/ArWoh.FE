import HeroSection from "@/components/landing/HeroSection"
import FeaturesSection from "@/components/landing/FeatureSection"
import CollectionShowcase from "@/components/landing/CollectionShowcase"
import ReviewsSection from "@/components/landing/ReviewsSection"

export default function LandingPage() {
	return (
		<main className="bg-black min-h-screen">
			<HeroSection />
			<FeaturesSection />
			<CollectionShowcase />
			<ReviewsSection />
		</main>
	)
}

