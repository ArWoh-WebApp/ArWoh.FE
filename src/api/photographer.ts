/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance"
import { UserService } from "./user"
import { ApiResponse } from "./apiResponse"

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


export const photographerService = {
    // Reuse 2 function bên user
    getPhotographerProfile: UserService.getUserProfile,
    updateAvatar: UserService.updateAvatar,

    // Get photographer images
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
}

