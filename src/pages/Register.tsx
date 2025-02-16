"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import logoImage from "@/assets/images/logo.png"
import Iridescence from "@/components/ui/iridescence"

export default function RegisterPage() {
	const [showPassword1, setShowPassword1] = useState(false)
	const [showPassword2, setShowPassword2] = useState(false)

	return (
		<main className="min-h-screen w-full relative bg-[#0D0D0D] overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<Iridescence
					color={[0.2, 0, 0.3]} // Darker purple
					speed={0.5}
					amplitude={0.2}
					mouseReact={true}
				/>
			</div>

			{/* Logo */}
			<div className="relative z-10 p-6">
				<img src={logoImage} alt="ArtWoh" className="h-8" />
			</div>

			{/* Login Form */}
			<div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
				<div
					className="w-full max-w-[400px] p-8 rounded-2xl backdrop-blur-xl border border-white/20"
					style={{
						background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
						boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
					}}
				>
					<div className="space-y-6">
						<div className="space-y-1">
							<h2 className="text-base text-white/90">WELCOME</h2>
							<h1 className="text-2xl font-semibold text-white">Register</h1>
							<p className="text-sm text-gray-400">Lorem ipsum is simply</p>
						</div>

						<div className="space-y-4">

							<div className="space-y-2">
								<Label htmlFor="email" className="text-white">
									Email
								</Label>
								<Input
									id="email"
									placeholder="Enter your email"
									className="bg-white border-0 text-black placeholder:text-gray-500 h-12"
								/>
							</div>


							<div className="space-y-2">
								<Label htmlFor="username" className="text-white">
									Username
								</Label>
								<Input
									id="username"
									placeholder="Enter your username"
									className="bg-white border-0 text-black placeholder:text-gray-500 h-12"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-white">
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword1 ? "text" : "password"}
										placeholder="Enter your password"
										className="bg-white border-0 text-black placeholder:text-gray-500 h-12"
									/>
									<button
										type="button"
										onClick={() => setShowPassword1(!showPassword1)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
									>
										{showPassword1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-white">
									Confirm Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword2 ? "text" : "password"}
										placeholder="Confirm your password"
										className="bg-white border-0 text-black placeholder:text-gray-500 h-12"
									/>
									<button
										type="button"
										onClick={() => setShowPassword2(!showPassword2)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
									>
										{showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
							</div>


							<Button
								className="w-full h-12 text-white text-base font-medium"
								style={{
									background: "linear-gradient(90deg, #4F0094, #920072)",
									border: "none",
									borderRadius: "8px",
								}}
							>
								Register
							</Button>

						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

