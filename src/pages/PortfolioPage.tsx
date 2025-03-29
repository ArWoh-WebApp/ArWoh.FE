"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Loader2, Camera, MapPin } from "lucide-react"
import { photographerPortfolioService, type Photographer } from "@/api/photographerPortfolio"
import { toast } from "sonner"

export default function PortfolioPage() {
    const [photographers, setPhotographers] = useState<Photographer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPhotographers = async () => {
            try {
                setIsLoading(true)
                const response = await photographerPortfolioService.getAllPhotographers()
                if (response.isSuccess) {
                    setPhotographers(response.data)
                } else {
                    toast.error(response.message || "Failed to load photographers")
                }
            } catch (error) {
                console.error("Error fetching photographers:", error)
                toast.error("Failed to load photographers")
            } finally {
                setIsLoading(false)
            }
        }

        fetchPhotographers()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 200,
            },
        },
    }

    const handlePhotographerClick = (photographerId: number) => {

        // Navigate to the photographer's profile page
        // You might need to adjust this based on your routing structure
        navigate(`/photographer/${photographerId}`)

    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-bold text-white">Our Photographers</h1>
                <p className="mx-auto max-w-2xl text-white/60">
                    Discover talented photographers from around the world. Browse their portfolios and find the perfect artist for
                    your next project.
                </p>
            </div>

            {photographers.length === 0 ? (
                <div className="flex h-[30vh] items-center justify-center">
                    <p className="text-white/60">No photographers found</p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {photographers.map((photographer) => (
                        <motion.div
                            key={photographer.userId}
                            className="group cursor-pointer overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm transition-all duration-300 hover:bg-black/30 hover:shadow-lg hover:shadow-purple-500/10"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            onClick={() => handlePhotographerClick(photographer.userId)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={photographer.profilePictureUrl || "/placeholder.svg"}
                                    alt={photographer.username}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="mb-2 text-xl font-semibold text-white">{photographer.username}</h3>
                                <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
                                    <Camera className="h-4 w-4" />
                                    <span>Photographer</span>
                                    <MapPin className="ml-2 h-4 w-4" />
                                    <span>Vietnam</span>
                                </div>
                                <p className="line-clamp-3 text-sm text-white/80">{photographer.bio || "No bio provided"}</p>
                                <div className="mt-4 flex justify-between">
                                    <span className="text-sm text-purple-400">View Portfolio</span>
                                    <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                                        {photographer.role}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

