import ArtworkList from "@/components/artworkList/ArtworkGrid"

export default function ArtworkPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="space-y-4 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Explore Artworks</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Discover unique digital artworks created by talented artists from around the world.
                    </p>
                </div>
                <ArtworkList />
            </div>
        </main>
    )
}

