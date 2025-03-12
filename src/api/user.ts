/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance"

const PROFILE_API = "/users/me/profile"
const UPDATE_AVATAR_API = "/users/me/avatar"
const USER_TRANSACTIONS_API = "/images/bought-by-user"

export namespace UserService {
    export interface ApiResponse<T> {
        isSuccess: boolean
        message: string
        data: T
    }

    export interface User {
        id: number
        username: string
        email: string
        role: number
        bio: string | null
        profilePictureUrl: string | null
        createdAt: string
        updatedAt: string | null
    }

    export interface Transaction {
        id: number
        photographerId: number
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

    export interface UpdateAvatarResponse {
        isSuccess: boolean
        message: string
        data: {
            userId: number
            username: string
            email: string | null
            bio: string | null
            profilePictureUrl: string
        }
    }

    // Fetch User Profile
    export async function getUserProfile(): Promise<ApiResponse<User>> {
        try {
            const response = await axiosInstance.get<ApiResponse<User>>(PROFILE_API)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch user profile",
                data: null as any,
            }
        }
    }

    // Update Avatar
    export async function updateAvatar(file: File): Promise<UpdateAvatarResponse> {
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await axiosInstance.put<UpdateAvatarResponse>(UPDATE_AVATAR_API, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to update avatar",
                data: null as any,
            }
        }
    }

    // Fetch User Transactions
    export async function getUserTransactions(): Promise<ApiResponse<Transaction[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<Transaction[]>>(USER_TRANSACTIONS_API)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch user transactions",
                data: [] as any,
            }
        }
    }
}

