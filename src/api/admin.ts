import axiosInstance from "./axiosInstance"
import type { ApiResponse } from "./apiResponse"
import type { ShippingOrder } from "./userShipping"

// Interface for updating shipping order status
export interface UpdateShippingStatusRequest {
    status: "Pending" | "Confirmed" | "Packaging" | "Shipping" | "Delivered" | "Cancelled"
    note: string
}

// Admin shipping service
export const adminShippingService = {
    // Get all shipping orders
    getAllShippingOrders: async (): Promise<ApiResponse<ShippingOrder[]>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<ShippingOrder[]>>("/admin/shipping/orders")
            return response.data
        } catch (error) {
            console.error("Error fetching all shipping orders:", error)
            return {
                isSuccess: false,
                message: "Failed to fetch shipping orders",
                data: [],
            }
        }
    },

    // Update shipping order status
    updateShippingStatus: async (
        orderId: number,
        data: UpdateShippingStatusRequest,
    ): Promise<ApiResponse<ShippingOrder>> => {
        try {
            const response = await axiosInstance.put<ApiResponse<ShippingOrder>>(
                `/admin/shipping/orders/${orderId}/status`,
                data,
            )
            return response.data
        } catch (error) {
            console.error(`Error updating shipping status for order ${orderId}:`, error)
            return {
                isSuccess: false,
                message: "Failed to update shipping status",
                data: {} as ShippingOrder,
            }
        }
    },

    // Upload delivery proof image
    uploadDeliveryProof: async (orderId: number, imageFile: File): Promise<ApiResponse<ShippingOrder>> => {
        try {
            const formData = new FormData()
            formData.append("image", imageFile)

            const response = await axiosInstance.post<ApiResponse<ShippingOrder>>(
                `/admin/shipping/orders/${orderId}/proof-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            )
            return response.data
        } catch (error) {
            console.error(`Error uploading proof image for order ${orderId}:`, error)
            return {
                isSuccess: false,
                message: "Failed to upload delivery proof image",
                data: {} as ShippingOrder,
            }
        }
    },
}
