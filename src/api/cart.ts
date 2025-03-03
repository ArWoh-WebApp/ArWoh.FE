/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserService} from "./user"
import axiosInstance from "./axiosInstance"

// Cart Types
export interface CartItem {
    id: string
    artworkId: string
    title: string
    description: string
    price: number
    quantity: number
    src: string
    orientation: "landscape" | "portrait"
    tags: string[]
    location: string
    user: UserService.User
}

export interface Cart {
    id: string
    userId: string
    items: CartItem[]
    createdAt: string
    updatedAt: string
}

export interface CreateCartItemDto {
    artworkId: string
    quantity: number
}

export interface UpdateCartItemDto {
    quantity: number
}

export interface CartResponse {
    isSuccess: boolean
    message: string
    data: Cart
}

// Cart API Endpoints
const CART_API = {
    CREATE_CART: "carts",
    GET_CARTS: "carts",
    GET_MY_CART: "carts/me",
    UPDATE_MY_CART: "carts/me",
    DELETE_CART_ITEM: (itemId: string) => `carts/me/${itemId}`,
}

// Cart Service
export const cartService = {
    createCart: async (items: CreateCartItemDto[]) => {
        try {
            const response = await axiosInstance.post<CartResponse>(CART_API.CREATE_CART, { items })
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to create cart")
        }
    },

    getCarts: async () => {
        try {
            const response = await axiosInstance.get<{ isSuccess: boolean; message: string; data: Cart[] }>(
                CART_API.GET_CARTS,
            )
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch carts")
        }
    },

    getMyCart: async () => {
        try {
            const response = await axiosInstance.get<CartResponse>(CART_API.GET_MY_CART)
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch cart")
        }
    },

    updateCartItem: async (itemId: string, data: UpdateCartItemDto) => {
        try {
            const response = await axiosInstance.put<CartResponse>(`${CART_API.UPDATE_MY_CART}/${itemId}`, data)
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update cart item")
        }
    },

    deleteCartItem: async (itemId: string) => {
        try {
            const response = await axiosInstance.delete<CartResponse>(CART_API.DELETE_CART_ITEM(itemId))
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete cart item")
        }
    },
}

