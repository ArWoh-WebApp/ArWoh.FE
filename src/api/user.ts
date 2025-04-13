/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance"
import { ApiResponse } from "./apiResponse"

const PROFILE_API = "/users/me/profile"
const UPDATE_AVATAR_API = "/users/me/avatar"

export namespace UserService {


    export interface User {
        id: number
        username: string
        email: string
        role: "Customer" | "Photographer" | "Admin"
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

    export interface UpdateProfileRequest {
        username: string
        email: string
        bio: string | null
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

    // Update User Profile
    export async function updateUserProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<User>> {
        try {
            const response = await axiosInstance.put<ApiResponse<User>>(PROFILE_API, profileData)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to update user profile",
                data: null as any,
            }
        }
    }

}

