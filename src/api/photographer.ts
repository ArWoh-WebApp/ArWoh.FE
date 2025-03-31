/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance"
import { UserService } from "./user"
import type { ApiResponse } from "./apiResponse"

export interface PhotographerImage {
    id: number
    photographerId: number
    title: string
    description: string
    price: number
    storyOfArt: string | null
    orientation: string | null
    tags: string[]
    location: string | null
    fileName: string | null
    url: string
}

export interface UpdateImageRequest {
    title: string
    description: string
    price: number
    storyOfArt: string 
    orientation: string
    tags: string[]
    location: string
    fileName: string
    url: string
}

export interface UploadImageRequest {
    title: string
    description: string
    price: number
    location: string
    orientation: "Portrait" | "Landscape"
    tags: string[]
    storyOfArt: string 
    file: File
}

// interfaces for the revenue data
export interface ImageSale {
    imageId: number
    imageTitle: string
    imageUrl: string
    salesCount: number
    totalAmount: number
}

export interface RevenueData {
    totalRevenue: number
    totalImagesSold: number
    imageSales: ImageSale[]
}

// Add interface for photographer profile
export interface PhotographerProfile {
    userId: number
    username: string
    email: string
    role: string
    bio: string | null
    profilePictureUrl: string | null
}

export const photographerService = {
    // Reuse 2 function bên user
    getPhotographerProfile: UserService.getUserProfile,
    updateAvatar: UserService.updateAvatar,

    // New function to get photographer profile by ID
    getPhotographerProfileById: async (photographerId: number): Promise<ApiResponse<PhotographerProfile>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<PhotographerProfile>>(
                `/photographers/${photographerId}/profile`,
            )
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch photographer profile",
                data: null as any,
            }
        }
    },

    // Get photographer images by Id
    getPhotographerImages: async (photographerId: number): Promise<ApiResponse<PhotographerImage[]>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<PhotographerImage[]>>(
                `/photographers/${photographerId}/images`,
            )
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch photographer images",
                data: [],
            }
        }
    },

    // Get a single image by ID
    getImageById: async (id: number): Promise<ApiResponse<PhotographerImage>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<PhotographerImage>>(`/images/${id}`)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch image",
                data: null as any,
            }
        }
    },

    // Update an image by ID
    updateImage: async (id: number, imageData: UpdateImageRequest): Promise<ApiResponse<PhotographerImage>> => {
        try {
            const response = await axiosInstance.put<ApiResponse<PhotographerImage>>(`/images/${id}`, imageData)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to update image",
                data: null as any,
            }
        }
    },

    // Delete an image by ID
    deleteImage: async (id: number): Promise<ApiResponse<boolean>> => {
        try {
            const response = await axiosInstance.delete<ApiResponse<boolean>>(`/images/${id}`)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to delete image",
                data: false,
            }
        }
    },

    // Upload a new image
    uploadImage: async (imageData: UploadImageRequest): Promise<ApiResponse<PhotographerImage>> => {
        try {
            // Create a FormData object to handle the multipart/form-data request
            const formData = new FormData()

            // Add required fields to the form data
            formData.append("title", imageData.title)
            formData.append("description", imageData.description)
            formData.append("price", imageData.price.toString())
            formData.append("location", imageData.location)
            formData.append("orientation", imageData.orientation)
            formData.append("storyOfArt", imageData.storyOfArt) // This will now contain HTML content

            // Add tags as separate items
            if (imageData.tags && imageData.tags.length > 0) {
                imageData.tags.forEach((tag) => {
                    formData.append("tags", tag)
                })
            }

            // Add the file
            formData.append("file", imageData.file)

            // Send the request with the form data
            const response = await axiosInstance.post<ApiResponse<PhotographerImage>>("/images/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to upload image",
                data: null as any,
            }
        }
    },

    // Add the getPhotographerRevenue function to the photographerService object
    getPhotographerRevenue: async (): Promise<ApiResponse<RevenueData>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<RevenueData>>("/photographers/revenue/me")
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch revenue data",
                data: {
                    totalRevenue: 0,
                    totalImagesSold: 0,
                    imageSales: [],
                },
            }
        }
    },
}

