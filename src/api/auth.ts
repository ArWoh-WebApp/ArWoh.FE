/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance";

const LOGIN_API = "/auth/login"
const REGISTER_API = "/auth/register"

export namespace Auth {

    //REGISTER
    //Payload gửi đi tới API
    export interface RegisterPayload {
        email: string;
        password: string;
    }
    //User data - register response trả về
    export interface RegisterResponseData {
        userId: number;
        email: string;
        fullname: string | null
    }
    //Response: API trả về
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

    export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
        const response = await axiosInstance.post<RegisterResponse>(REGISTER_API, payload,);
        return response.data;
    }

    export function logout(): void {
        localStorage.removeItem("accessToken")
    }

    export function getToken(): string | null {
        return localStorage.getItem("accessToken")
    }
}
