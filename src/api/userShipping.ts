import axiosInstance from "./axiosInstance"
import type { ApiResponse } from "./apiResponse"

// Interfaces for Shippable Images
export interface ShippableImage {
    imageId: number
    title: string
    description: string
    price: number
    url: string
    purchaseDate: string
    orderId: number
}

// Interfaces for Shipping Order Details
export interface OrderDetail {
    orderDetailId: number
    imageId: number
    imageTitle: string
    imageUrl: string
    price: number
    quantity: number
}

// Interface for Shipping Order
export interface ShippingOrder {
    orderId: number
    createdAt: string
    totalAmount: number
    originalPrice: number
    shippingFee: number
    shippingAddress: string
    shippingStatus: "Pending" | "Confirmed" | "Packaging" | "Shipping" | "Delivered" | "Cancelled"
    confirmNote: string | null
    packagingNote: string | null
    shippingNote: string | null
    deliveryNote: string | null
    customerName: string | null
    customerEmail: string | null
    customerId: number
    deliveryProofImageUrl: string | null
    orderDetails: OrderDetail[]
}

// Interface for Create Shipping Order Request
export interface CreateShippingOrderRequest {
    imageIds: number[]
    shippingAddress: string
    customerNote?: string
}

// Shipping Service
export const shippingService = {
    // Get all shippable images for the current user
    getShippableImages: async (): Promise<ApiResponse<ShippableImage[]>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<ShippableImage[]>>("/shipping/shippable-images")
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch shippable images",
                data: [],
            }
        }
    },

    // Create a new shipping order
    createShippingOrder: async (orderData: CreateShippingOrderRequest): Promise<ApiResponse<ShippingOrder>> => {
        try {
            const response = await axiosInstance.post<ApiResponse<ShippingOrder>>("/shipping/orders", orderData)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to create shipping order",
                data: null as any,
            }
        }
    },

    // Get all shipping orders for the current user
    getShippingOrders: async (): Promise<ApiResponse<ShippingOrder[]>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<ShippingOrder[]>>("/shipping/orders")
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch shipping orders",
                data: [],
            }
        }
    },

    // Get a specific shipping order by ID
    getShippingOrderById: async (orderId: number): Promise<ApiResponse<ShippingOrder>> => {
        try {
            const response = await axiosInstance.get<ApiResponse<ShippingOrder>>(`/shipping/orders/${orderId}`)
            return response.data
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.message || "Failed to fetch shipping order details",
                data: null as any,
            }
        }
    },
}