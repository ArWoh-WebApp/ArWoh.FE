import { useNavigate } from "react-router-dom"
import { ChevronDown, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import logoImage from "@/assets/images/logo.png"

export default function Header() {
	const navigate = useNavigate()

	return (
		<header className="w-full bg-black px-6 py-4">
			<div className="max-w-[1400px] mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex-shrink-0">
					<img src={logoImage || "/placeholder.svg"} alt="ArtWoh" className="h-6" />
				</div>

				{/* Navigation */}
				<nav className="hidden md:flex items-center space-x-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="text-white">
								Artwork <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => navigate("/artwork-list")}>List of Artwork</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="text-white">
								Explore <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Portfolio</DropdownMenuItem>
							<DropdownMenuItem>Story of Art</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="text-white">
								Other <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Option 1</DropdownMenuItem>
							<DropdownMenuItem>Option 2</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</nav>

				{/* Actions */}
				<div className="flex items-center space-x-4">
					<button className="text-white hover:text-gray-200">
						<ShoppingCart className="h-6 w-6" />
					</button>
					<button className="text-white hover:text-gray-200">
						<Heart className="h-6 w-6" />
					</button>
					<div className="hidden sm:flex items-center space-x-2">
						<Button
							variant="outline"
							className="bg-white text-black hover:bg-white/90 border-0 px-6 transition-colors"
							size="sm"
							onClick={() => navigate("/login")}
						>
							Login
						</Button>
						<Button
							variant="outline"
							className="bg-black text-white border-white/20 px-6 transition-all hover:bg-white hover:border-white hover:text-black"
							size="sm"
							onClick={() => navigate("/register")}
						>
							Register
						</Button>
					</div>
				</div>
			</div>
		</header>
	)
}

