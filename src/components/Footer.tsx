"use client"

import { Instagram, Twitter, Facebook, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import logoImage from "@/assets/images/logo.png"

export default function Footer() {
    return (
        <footer className="mt-auto bg-black border-t border-white/10 pt-12 pb-6">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <img src={logoImage} alt="ArWoh" className="h-8" />
                        <p className="text-sm text-white/60">
                            Discover unique artwork that speaks to your style and transforms your space into a personal gallery.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" className="rounded-full text-white/60 hover:text-white">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full text-white/60 hover:text-white">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full text-white/60 hover:text-white">
                                <Facebook className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    Artwork
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    Shipping & Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h3>
                        <p className="text-sm text-white/60">Subscribe to our newsletter for updates and promotions.</p>
                        <div className="flex space-x-2">
                            <Input type="email" placeholder="Your email" className="bg-white/5 border-white/10 text-white" />
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
                    <p>&copy; {new Date().getFullYear()} ArWoh. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

