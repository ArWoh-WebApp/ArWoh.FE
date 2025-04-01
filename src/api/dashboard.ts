import axiosInstance from "./axiosInstance";

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T;
}

export interface UserSummaryDTO {
    totalUsers: number;
    adminCount: number;
    userCount: number;
    photographerCount: number;
}

export interface ImageSummaryDTO {
    totalImages: number;
    imageOrientations: { [key: string]: number };
}

export interface RevenueSummaryDTO {
    totalRevenue: number;
    monthlyRevenue: { [key: string]: number };
}

export const fetchUserSummary = async (): Promise<ApiResponse<UserSummaryDTO>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<UserSummaryDTO>>(
            "http://localhost:9090/api/dashboard/users/summary"
        );
        return response.data;
    } catch (error: any) {
        return {
            isSuccess: false,
            message: error.message || "Failed to fetch user summary",
            data: null as any, 
        };
    }
};

export const fetchImageSummary = async (): Promise<ApiResponse<ImageSummaryDTO>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<ImageSummaryDTO>>(
            "http://localhost:9090/api/dashboard/images/summary"
        );
        return response.data;
    } catch (error: any) {
        return {
            isSuccess: false,
            message: error.message || "Failed to fetch image summary",
            data: null as any,
        };
    }
};

export const fetchRevenueSummary = async (): Promise<ApiResponse<RevenueSummaryDTO>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<RevenueSummaryDTO>>(
            "http://localhost:9090/api/dashboard/revenue/summary"
        );
        return response.data;
    } catch (error: any) {
        return {
            isSuccess: false,
            message: error.message || "Failed to fetch revenue summary",
            data: null as any,
        };
    }
};