"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Iridescence from "@/components/ui/iridescence"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import logoImage from "@/assets/images/logo.png"

export default function RegisterPage() {
	const [showPassword1, setShowPassword1] = useState(false)
	const [showPassword2, setShowPassword2] = useState(false)

	return (
		<main className="min-h-screen w-full relative bg-[#0D0D0D] overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<Iridescence
					color={[0.2, 0, 0.3]} // Darker purple
					speed={0.7}
					amplitude={0.2}
					mouseReact={true}
				/>
			</div>

			{/* Logo */}
			<div className="relative z-10 p-6">
				<img src={logoImage || "/placeholder.svg"} alt="ArWoh" className="h-8" />
			</div>

			{/* Register Form */}
			<div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
				<div
					className="max-w-md w-full mx-auto rounded-2xl p-8 backdrop-blur-xl border border-white/20"
					style={{
						background: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
						boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
					}}
				>
					<h2 className="font-bold text-xl text-white">Register</h2>
					<p className="text-gray-300 text-sm max-w-sm mt-2">Create your account.</p>

					<form className="my-8">
						<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
							<LabelInputContainer>
								<Label className="text-white" htmlFor="firstname">
									First name
								</Label>
								<Input id="firstname" placeholder="Tyler" type="text" />
							</LabelInputContainer>
							<LabelInputContainer>
								<Label className="text-white" htmlFor="lastname">
									Last name
								</Label>
								<Input id="lastname" placeholder="Durden" type="text" />
							</LabelInputContainer>
						</div>
						<LabelInputContainer className="mb-4">
							<Label className="text-white" htmlFor="email">
								Email Address
							</Label>
							<Input id="email" placeholder="projectmayhem@fc.com" type="email" />
						</LabelInputContainer>
						<LabelInputContainer className="mb-4">
							<Label className="text-white" htmlFor="role">
								Role
							</Label>
							<Select>
								<SelectTrigger id="role" className="bg-white border-0 text-black placeholder:text-gray-500 h-10">
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent className="bg-white text-black">
									<SelectItem value="customer">Customer</SelectItem>
									<SelectItem value="photographer">Photographer</SelectItem>
								</SelectContent>
							</Select>
						</LabelInputContainer>
						<LabelInputContainer className="mb-4">
							<Label className="text-white" htmlFor="password">
								Password
							</Label>
							<div className="relative">
								<Input id="password" placeholder="••••••••" type={showPassword1 ? "text" : "password"} />
								<button
									type="button"
									onClick={() => setShowPassword1(!showPassword1)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
								>
									{showPassword1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</LabelInputContainer>
						<LabelInputContainer className="mb-4">
							<Label className="text-white" htmlFor="confirmPassword">
								Confirm password
							</Label>
							<div className="relative">
								<Input id="confirmPassword" placeholder="••••••••" type={showPassword2 ? "text" : "password"} />
								<button
									type="button"
									onClick={() => setShowPassword2(!showPassword2)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
								>
									{showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</LabelInputContainer>
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
					</form>
					<div className="text-sm text-center text-gray-300 mt-6">
						Already have an account?{" "}
						<a href="/login" className="text-purple-600 font-bold hover:text-purple-500">
							Login
						</a>
					</div>
					<div className="mt-8 text-xs text-center text-gray-400">
						By registering, you agree to our{" "}
						<a href="/terms" className="text-purple-600 hover:text-purple-500">
							Terms of Service
						</a>{" "}
						and{" "}
						<a href="/privacy" className="text-purple-600 hover:text-purple-500">
							Privacy Policy
						</a>
						.
					</div>
				</div>
			</div>
		</main>
	)
}

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

