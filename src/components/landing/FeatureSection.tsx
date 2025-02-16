import { Box } from "lucide-react"

export default function FeaturesSection() {
    return (
        <section className="bg-black text-white py-24">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="space-y-6 mb-16">
                    <p className="text-sm">Explore</p>
                    <h2 className="text-4xl md:text-5xl font-bold">Discover Your Perfect Artwork with Ease</h2>
                    <p className="text-gray-400 max-w-3xl">
                        Selecting and purchasing artwork has never been easier. With our innovative 3D mockup feature, you can
                        visualize your chosen pieces in real-time before making a decision.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    <div className="space-y-4">
                        <Box className="w-12 h-12 text-purple-600" />
                        <h3 className="text-xl font-semibold">Simple Steps to Purchase Your Artwork</h3>
                        <p className="text-gray-400">Browse our extensive collection and find what resonates with you.</p>
                    </div>

                    <div className="space-y-4">
                        <Box className="w-12 h-12 text-purple-600" />
                        <h3 className="text-xl font-semibold">Experience Artwork Like Never Before</h3>
                        <p className="text-gray-400">Our 3D mockups allow you to see how the artwork will look in your space.</p>
                    </div>

                    <div className="space-y-4">
                        <Box className="w-12 h-12 text-purple-600" />
                        <h3 className="text-xl font-semibold">Seamless Checkout for Your Convenience</h3>
                        <p className="text-gray-400">
                            Once you've made your choice, our streamlined checkout process makes purchasing a breeze.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
                        Buy
                    </button>
                    <button className="px-6 py-2 border border-purple-600 rounded-full text-white hover:bg-purple-600/10 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    )
}

