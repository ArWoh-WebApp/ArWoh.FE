"use client"

import type React from "react"
import { toast } from "sonner"
import { Camera, User, Mail, FileText, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import aba from "@/assets/images/aba.png"

export default function UserProfile() {

	const handleAvatarClick = () => {
		// In a real app, this would trigger file upload
		toast.success("Avatar upload would be triggered here")
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		toast.success("Profile updated successfully!")
	}

	return (
		<div className="min-h-screen bg-black text-white p-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold mb-1">Profile</h1>
				<p className="text-gray-400 mb-8">This is how others will see you on the site.</p>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Avatar */}
					<div className="space-y-2">
						<Label className="text-white">Profile Picture</Label>
						<div
							onClick={handleAvatarClick}
							className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-[2px]">
								<div className="absolute inset-0 bg-black rounded-full m-[1px]" />
								<img
									src={aba}
									alt="Profile"
									className="relative w-full h-full object-cover rounded-full"
								/>
							</div>
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
								<Camera className="w-6 h-6 text-white" />
							</div>
						</div>
					</div>

					{/* Username */}
					<div className="space-y-2">
						<Label htmlFor="username" className="text-white">
							Username
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
							<Input id="username" defaultValue="johndoe" className="bg-white/5 border-white/10 pl-10 text-white" />
						</div>
					</div>

					{/* Email */}
					<div className="space-y-2">
						<Label htmlFor="email" className="text-white">
							Email
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
							<Input
								id="email"
								type="email"
								defaultValue="john@example.com"
								className="bg-white/5 border-white/10 pl-10 text-white"
							/>
						</div>
					</div>

					{/* Bio */}
					<div className="space-y-2">
						<Label htmlFor="bio" className="text-white">
							Bio
						</Label>
						<div className="relative">
							<FileText className="absolute left-3 top-3 text-gray-400" size={18} />
							<Textarea
								id="bio"
								defaultValue="I'm a digital artist passionate about creating unique experiences."
								className="bg-white/5 border-white/10 min-h-[100px] pl-10 text-white"
							/>
						</div>
					</div>

					{/* Website */}
					<div className="space-y-2">
						<Label htmlFor="website" className="text-white">
							Website
						</Label>
						<div className="relative">
							<Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
							<Input
								id="website"
								type="url"
								placeholder="https://your-website.com"
								className="bg-white/5 border-white/10 pl-10 text-white"
							/>
						</div>
					</div>

					{/* Submit Button */}
					<Button type="submit" className="bg-white text-black hover:bg-white/90">
						Update profile
					</Button>
				</form>
			</div>
		</div>
	)
}

