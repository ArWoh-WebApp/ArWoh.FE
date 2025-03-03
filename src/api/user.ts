/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import axiosInstance from "./axiosInstance";

const PROFILE_API = "/users/profile";
const UPDATE_AVATAR_API = "/users/me/avatar";

export namespace UserService {
    export interface ApiResponse<T> {
        isSuccess: boolean;
        message: string;
        data: T;
    }

    export interface User {
        id: number;
        username: string;
        email: string;
        role: "Customer" | "Photographer";
        bio: string | null;
        profilePictureUrl: string | null;
        createdAt: string;
        updatedAt: string | null;
    }

    export interface UpdateAvatarResponse {
        isSuccess: boolean;
        message: string;
        data: {
            userId: number;
            username: string;
            email: string | null;
            bio: string | null;
            profilePictureUrl: string;
        };
    }

    // Fetch User Profile
    export async function getUserProfile(): Promise<ApiResponse<User>> {
        try {
            const response = await axiosInstance.get<ApiResponse<User>>(PROFILE_API);
            return response.data;
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch user profile",
                data: null as any,
            };
        }
    }

    // Update Avatar
    export async function updateAvatar(file: File): Promise<UpdateAvatarResponse> {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.put<UpdateAvatarResponse>(UPDATE_AVATAR_API, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to update avatar",
                data: null as any,
            };
        }
    }
}
