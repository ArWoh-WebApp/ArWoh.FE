import axiosInstance from "./axiosInstance"
import { ApiResponse } from "./apiResponse"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED" | "ALL"

// Payment details interface
export interface PaymentDetail {
    paymentId: number
    orderId: number
    status: PaymentStatus
    paymentUrl: string
    amount: number
    createdAt: string
    updatedAt: string | null
}

// Payment transaction interface
export interface PaymentTransaction {
    id: number
    orderId: number
    amount: number
    paymentGateway: string
    status: PaymentStatus
    gatewayTransactionId: string
    paymentUrl: string
    createdAt: string
    updatedAt: string
}

// Payment filter parameters
export interface PaymentFilterParams {
    status?: PaymentStatus
    fromDate?: string
    toDate?: string
}

export const paymentService = {
    // Create a payment link
    createPaymentLink: async (): Promise<ApiResponse<string>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<string>>("/payments/create-link")
            return response.data
        } catch (error) {
            console.error("Error creating payment link:", error)
            return {
                isSuccess: false,
                message: "Failed to create payment link",
                data: "",
            }
        }
    },

    // Get user transactions with optional filtering
    getUserTransactions: async (params?: PaymentFilterParams): Promise<ApiResponse<PaymentTransaction[]>> => {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams()

            if (params?.status && params.status !== "ALL") {
                queryParams.append("status", params.status)
            }

            if (params?.fromDate) {
                queryParams.append("fromDate", params.fromDate)
            }

            if (params?.toDate) {
                queryParams.append("toDate", params.toDate)
            }

            // Construct URL with query parameters if they exist
            const url = queryParams.toString() ? `/users/me/payment?${queryParams.toString()}` : "/users/me/payment"

            const response = await axiosInstance.get<ApiResponse<PaymentTransaction[]>>(url)
            return response.data
        } catch (error) {
            console.error("Error fetching user transactions:", error)
            return {
                isSuccess: false,
                message: "Failed to fetch payment transactions",
                data: [],
            }
        }
    },

    // Get details for a specific payment by ID
    getPaymentById: async (paymentId: number): Promise<ApiResponse<PaymentDetail>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<PaymentDetail>>(`/payments/${paymentId}`)
            return response.data
        } catch (error) {
            console.error(`Error fetching payment details for ID ${paymentId}:`, error)
            return {
                isSuccess: false,
                message: "Failed to fetch payment details",
                data: {} as PaymentDetail,
            }
        }
    },

    // Cancel a payment by ID
    cancelPayment: async (paymentId: number, reason?: string): Promise<ApiResponse<boolean>> => {
        try {
            const response = await axiosInstance.post<ApiResponse<boolean>>(`/payments/${paymentId}/cancel`, {
                reason: reason || "Cancelled by user",
            })
            return response.data
        } catch (error) {
            console.error(`Error cancelling payment with ID ${paymentId}:`, error)
            return {
                isSuccess: false,
                message: "Failed to cancel payment",
                data: false,
            }
        }
    },
}
