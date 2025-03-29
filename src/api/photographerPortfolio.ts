import axiosInstance from "./axiosInstance"

// Define the Photographer interface based on the API response
export interface Photographer {
    userId: number
    username: string
    email: string
    role: string
    bio: string
    profilePictureUrl: string
}

// Define the API response interface
export interface ApiResponse<T> {
    isSuccess: boolean
    message: string
    data: T
}

// Photographer portfolio service
export const photographerPortfolioService = {
    getAllPhotographers: async (): Promise<ApiResponse<Photographer[]>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<Photographer[]>>("/users/photographers")
            return response.data
        } catch (error) {
            console.error("Error fetching photographers:", error)
            throw error
        }
    },
}

