"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Camera, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserService } from "@/api/user"

export function UserProfile() {
    const [user, setUser] = useState<UserService.User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form state
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: "",
    })

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await UserService.getUserProfile()
                if (response.isSuccess) {
                    setUser(response.data)
                    // Initialize form data with user data
                    setFormData({
                        username: response.data.username,
                        email: response.data.email,
                        bio: response.data.bio || "",
                    })
                } else {
                    toast.error(response.message || "Failed to load profile")
                }
            } catch (error) {
                toast.error("Error loading profile")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await handleFileUpload(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            await handleFileUpload(file)
        }
    }

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file")
            return
        }

        setIsUploading(true)
        try {
            const response = await UserService.updateAvatar(file)
            if (response.isSuccess) {
                setUser((prev) =>
                    prev
                        ? {
                            ...prev,
                            profilePictureUrl: response.data.profilePictureUrl,
                        }
                        : null,
                )
                toast.success("Avatar updated successfully")
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("Failed to update avatar")
            console.error("Avatar upload error:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const updateData: UserService.UpdateProfileRequest = {
                username: formData.username,
                email: formData.email,
                bio: formData.bio || null,
            }

            const response = await UserService.updateUserProfile(updateData)

            if (response.isSuccess) {
                setUser(response.data)
                toast.success("Profile updated successfully!")
            } else {
                toast.error(response.message || "Failed to update profile")
            }
        } catch (error) {
            console.error("Profile update error:", error)
            toast.error("An error occurred while updating your profile")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8 min-h-[calc(100vh-16rem)]">
            {/* Avatar Section */}
            <div className="flex items-start space-x-8">
                <div className="group relative" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                    <motion.div
                        animate={{
                            scale: isDragging ? 1.1 : 1,
                            borderColor: isDragging ? "rgba(147, 51, 234, 0.5)" : "rgba(255, 255, 255, 0.1)",
                        }}
                        className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-white/10"
                        onClick={handleAvatarClick}
                    >
                        <img
                            src={user?.profilePictureUrl || "/placeholder.svg"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Camera className="h-6 w-6 text-white" />
                        </div>
                        <AnimatePresence>
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/70"
                                >
                                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <motion.div
                        animate={{
                            opacity: isDragging ? 1 : 0,
                            scale: isDragging ? 1 : 0.95,
                        }}
                        className="pointer-events-none absolute -inset-4 rounded-xl border-2 border-dashed border-purple-500/50 bg-purple-500/10"
                    />
                </div>

                <div className="flex-1 space-y-1">
                    <h2 className="text-xl font-semibold">{user?.username || "Loading..."}</h2>
                    <p className="text-sm text-white/60">{user?.role || "User"}</p>
                    <p className="text-sm text-white/60">
                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "..."}
                    </p>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">
                            Username
                        </Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border-white/10 bg-white/5 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border-white/10 bg-white/5 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-white">
                            Bio
                        </Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself"
                            className="min-h-[100px] border-white/10 bg-white/5 text-white"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-transform hover:scale-[1.02]"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </form>
        </div>
    )
}
