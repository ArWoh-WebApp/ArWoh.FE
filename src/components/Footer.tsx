import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import footerLogo from "@/assets/images/logo.png"

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div className="space-y-8">
                        <img src={footerLogo || "/placeholder.svg"} alt="ArtWoh" className="h-8" />
                        <nav className="flex flex-wrap gap-6">
                            <a href="/about" className="text-sm hover:text-gray-300">
                                About Us
                            </a>
                            <a href="/contact" className="text-sm hover:text-gray-300">
                                Contact Us
                            </a>
                            <a href="/shop" className="text-sm hover:text-gray-300">
                                Shop Now
                            </a>
                            <a href="/gallery" className="text-sm hover:text-gray-300">
                                Gallery
                            </a>
                            <a href="/blog" className="text-sm hover:text-gray-300">
                                Blog
                            </a>
                        </nav>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Join</h3>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                {/* Gradient Border Container */}
                                <div
                                    className="absolute inset-0 rounded-lg"
                                    style={{
                                        background: "linear-gradient(90deg, #4F0094, #920072)",
                                        padding: "1px",
                                    }}
                                >
                                    {/* Inner Background */}
                                    <div className="w-full h-full bg-black rounded-lg" />
                                </div>

                                {/* Input */}
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="relative w-full bg-transparent border-0 focus:ring-0 focus:outline-none rounded-lg pl-4 pr-3 py-2 text-white placeholder:text-gray-400"
                                />
                            </div>
                            <Button
                                className="text-white px-8 rounded-lg"
                                style={{
                                    background: "linear-gradient(90deg, #4F0094, #920072)",
                                }}
                            >
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-xs text-gray-400">
                            By subscribing you agree to our Privacy Policy.{" "}
                            <a href="/privacy" className="text-[#8B2CF5] hover:text-[#9747FF]">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-6 relative">
                    {/* Gradient Border Line */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[1px]"
                        style={{
                            background: "linear-gradient(90deg, #4F0094, #920072)",
                            opacity: 1,
                        }}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <a href="/privacy" className="text-xs hover:text-gray-300">
                                Privacy Policy
                            </a>
                            <a href="/terms" className="text-xs hover:text-gray-300">
                                Terms of Service
                            </a>
                            <a href="/cookies" className="text-xs hover:text-gray-300">
                                Cookie Settings
                            </a>
                        </div>
                        <p className="text-xs text-gray-400">© 2024 ArtWoh. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

