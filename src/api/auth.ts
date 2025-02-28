/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance";

const LOGIN_API = "/auth/login"
const REGISTER_CUSTOMER_API = "/auth/register/customer"
const REGISTER_PHOTOGRAPHER_API = "/auth/register/photographer"

export namespace Auth {

    //REGISTER - Customer
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
        isSuccess: boolean;
        message: string;
        data: RegisterResponseData;
    }

    //lOGIN
    export interface LoginResponseData {
        accessToken: string;
        refreshToken: string;
    }
    export interface LoginResponse {
        isSuccess: boolean;
        message: string;
        data: LoginResponseData
    }
    export interface LoginPayload {
        email: string;
        password: string;
    }

    export async function login(payload: LoginPayload): Promise<LoginResponse> {
        const response = await axiosInstance.post<LoginResponse>(LOGIN_API, payload);
        if (response.data.isSuccess) {
            localStorage.setItem("accessToken", response.data.data.accessToken)
        }
        return response.data;
    }

    export async function registerCustomer(payload: RegisterPayload): Promise<RegisterResponse> {
        const response = await axiosInstance.post<RegisterResponse>(REGISTER_CUSTOMER_API, payload,);
        return response.data;
    }

    export async function registerPhotographer(payload: RegisterPayload): Promise<RegisterResponse> {
        const response = await axiosInstance.post<RegisterResponse>(REGISTER_PHOTOGRAPHER_API, payload,);
        return response.data;
    }

    export function logout(): void {
        localStorage.removeItem("accessToken")
    }

    export function getToken(): string | null {
        return localStorage.getItem("accessToken")
    }
}
