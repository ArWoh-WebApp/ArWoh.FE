/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance"

const LOGIN_API = "/auth/login"
const REGISTER_CUSTOMER_API = "/auth/register/customer"
const REGISTER_PHOTOGRAPHER_API = "/auth/register/photographer"

export namespace Auth {
    //REGISTER
    export interface RegisterPayload {
        username: string
        email: string
        password: string
    }

    // User data - register response
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

    //LOGIN
    export interface LoginResponse {
        isSuccess: boolean
        message: string
        data: string // JWT accessToken string - BE response quá điên
    }

    export interface LoginPayload {
        email: string
        password: string
    }


    export async function login(payload: LoginPayload): Promise<LoginResponse> {
        try {
            const response = await axiosInstance.post<LoginResponse>(LOGIN_API, payload)

            if (response.data.isSuccess) {
                localStorage.setItem("accessToken", response.data.data)
                return response.data
            }

            return response.data
        } catch (error: any) {
            // Handle specific error cases
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

            // Generic error handling
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