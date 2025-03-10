/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance  from "./axiosInstance"

export interface CheckoutResponse {
    success: boolean
    url: string
}

export const paymentService = {
    checkout: async (): Promise<CheckoutResponse> => {
        try {
            const response = await axiosInstance.post<CheckoutResponse>("/payment/checkout")
            return response.data
        } catch (error) {
            throw new Error("Failed to process checkout")
        }
    },
}

