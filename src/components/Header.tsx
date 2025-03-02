import { useNavigate } from "react-router-dom";
import { ChevronDown, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import logoImage from "@/assets/images/logo.png";

export default function Header() {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout } = useAuth();

	return (
		<header className="w-full bg-black px-6 py-4">
			<div className="max-w-[1400px] mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex-shrink-0">
					<Button variant="link" onClick={() => navigate("/")}>
						<img src={logoImage || "/placeholder.svg"} alt="ArWoh" className="h-6" />
					</Button>
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
							<DropdownMenuItem onClick={() => navigate("/art-gallery")}>Photo Gallery</DropdownMenuItem>
							<DropdownMenuItem>Printing</DropdownMenuItem>
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

					{isAuthenticated ? (
						// Show Avatar + Dropdown Menu if logged in
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer">
									<AvatarImage src={user?.profilePictureUrl || "/default-avatar.png"} />
									<AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => navigate("/user-profile")}>Profile</DropdownMenuItem>
								<DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						// Show Login/Register if not authenticated
						<div className="hidden sm:flex items-center space-x-2">
							<Button
								variant="outline"
								className="bg-white text-black px-6 transition-colors"
								size="sm"
								onClick={() => navigate("/login")}
							>
								Login
							</Button>
							<Button
								variant="outline"
								className="bg-black text-white border-white/20 px-6 transition-all"
								size="sm"
								onClick={() => navigate("/register")}
							>
								Register
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
