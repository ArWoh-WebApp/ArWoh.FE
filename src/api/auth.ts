/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance"

const LOGIN_API = "/auth/login"
const REGISTER_CUSTOMER_API = "/auth/register/customer"
const REGISTER_PHOTOGRAPHER_API = "/auth/register/photographer"
const PROFILE_API = "/users/profile"
const UPDATE_AVATAR_API = "/users/me/avatar"
//const UPDATE_PROFILE_API = "/users/profile"
//const UPDATE_AVATAR_API = "/users/avatar"

export namespace Auth {
    // Common Types
    export interface ApiResponse<T> {
        isSuccess: boolean
        message: string
        data: T
    }

    // User Types
    export interface User {
        id: number
        username: string
        email: string
        role: "Customer" | "Photographer"
        bio: string | null
        profilePictureUrl: string | null
        createdAt: string
        updatedAt: string | null
    }

    // Request/Response Types
    export interface RegisterPayload {
        username: string
        email: string
        password: string
    }

    export interface RegisterResponseData {
        username: string
        email: string
        passwordHash: string
        role: "Customer" | "Photographer"
        bio: string
        profilePictureUrl: string
        images: null
        transactions: null
        id: number
        createdAt: string
        updatedAt: string | null
        isDeleted: boolean
        deletedAt: string | null
    }

    export interface RegisterResponse {
        isSuccess: boolean
        message: string
        data: RegisterResponseData
    }

    export interface LoginPayload {
        email: string
        password: string
    }

    export interface LoginResponse {
        isSuccess: boolean
        message: string
        data: string // JWT accessToken string (vì BE ko thèm chia access, refresh)
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

    // export interface UpdateProfilePayload {
    //     username?: string
    //     bio?: string
    //     phoneNumber?: string
    //     address?: string
    //     dateOfBirth?: string
    //     gender?: "male" | "female" | "other"
    //     preferences?: {
    //         emailNotifications?: boolean
    //         marketingEmails?: boolean
    //         [key: string]: any
    //     }
    // }


    // Auth Functions
    export async function login(payload: LoginPayload): Promise<LoginResponse> {
        try {
            const response = await axiosInstance.post<LoginResponse>(LOGIN_API, payload)

            if (response.data.isSuccess) {
                localStorage.setItem("accessToken", response.data.data)
                return response.data
            }

            return response.data
        } catch (error: any) {
            if (error.code === "ERR_NETWORK") {
                return {
                    isSuccess: false,
                    message: "Unable to connect to the server. Please check your connection and try again.",
                    data: "",
                }
            }

            if (error.response?.status === 401) {
                return {
                    isSuccess: false,
                    message: "Invalid email or password",
                    data: "",
                }
            }

            return {
                isSuccess: false,
                message: error.message || "An unexpected error occurred",
                data: "",
            }
        }
    }

    export async function registerCustomer(payload: RegisterPayload): Promise<RegisterResponse> {
        try {
            const response = await axiosInstance.post<RegisterResponse>(REGISTER_CUSTOMER_API, payload)
            return response.data
        } catch (error: any) {
            if (error.response?.status === 409) {
                return {
                    isSuccess: false,
                    message: "Email already exists",
                    data: null as any,
                }
            }

            return {
                isSuccess: false,
                message: error.message || "Registration failed",
                data: null as any,
            }
        }
    }

    export async function registerPhotographer(payload: RegisterPayload): Promise<RegisterResponse> {
        try {
            const response = await axiosInstance.post<RegisterResponse>(REGISTER_PHOTOGRAPHER_API, payload)
            return response.data
        } catch (error: any) {
            if (error.response?.status === 409) {
                return {
                    isSuccess: false,
                    message: "Email already exists",
                    data: null as any,
                }
            }

            return {
                isSuccess: false,
                message: error.message || "Registration failed",
                data: null as any,
            }
        }
    }

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

    // export async function updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<UserProfile>> {
    //     try {
    //         const response = await axiosInstance.put<ApiResponse<UserProfile>>(UPDATE_PROFILE_API, payload)
    //         return response.data
    //     } catch (error: any) {
    //         return {
    //             isSuccess: false,
    //             message: error.message || "Failed to update profile",
    //             data: null as any,
    //         }
    //     }
    // }


    // export async function updateAvatar(file: File): Promise<ApiResponse<{ profilePictureUrl: string }>> {
    //     try {
    //         const formData = new FormData()
    //         formData.append("avatar", file)

    //         const response = await axiosInstance.post<ApiResponse<{ profilePictureUrl: string }>>(
    //             UPDATE_AVATAR_API,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             },
    //         )
    //         return response.data
    //     } catch (error: any) {
    //         return {
    //             isSuccess: false,
    //             message: error.message || "Failed to update avatar",
    //             data: null as any,
    //         }
    //     }
    // }

    // Auth Utility Functions
    export function logout(): void {
        localStorage.removeItem("accessToken")
    }

    export function getToken(): string | null {
        return localStorage.getItem("accessToken")
    }

    export function isAuthenticated(): boolean {
        return !!getToken()
    }
}

