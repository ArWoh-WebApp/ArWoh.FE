import { useNavigate } from "react-router-dom"
import { ChevronDown, LogOut, UserCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

import logoImage from "@/assets/images/logo.png"

export default function Header() {
	const navigate = useNavigate()
	const { isAuthenticated, user, logout, isLoading } = useAuth()

	const handleLogout = async () => {
		logout()
		navigate("/login")
	}

	return (
		<header className="w-full bg-black px-6 py-4">
			<div className="max-w-[1400px] mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex-shrink-0">
					<Button variant="link" onClick={() => navigate("/")}>
						<img src={logoImage || "/placeholder.svg"} alt="ArWoh" className="h-8" />
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
					{isLoading ? (
						<div className="w-10 h-10 flex items-center justify-center">
							<Loader2 className="h-5 w-5 animate-spin text-white" />
						</div>
					) : isAuthenticated && user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
									<Avatar className="h-10 w-10">
										<AvatarImage src={user.profilePictureUrl || "/default-avatar.png"} alt={user.username} />
										<AvatarFallback className="bg-purple-600">{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56 bg-black border border-white/10" align="end">
								<DropdownMenuLabel className="text-white">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium">{user.username}</p>
										<p className="text-xs text-gray-400">{user.email}</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="bg-white/10" />
								<DropdownMenuItem
									className="text-white focus:bg-white/10 focus:text-white"
									onClick={() => navigate("/user-profile")}
								>
									<UserCircle className="mr-2 h-4 w-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500 focus:bg-white/10 focus:text-red-500" onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
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
	)
}

