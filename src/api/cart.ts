import axiosInstance from "./axiosInstance"

// Cart Types
export interface CartItem {
    cartItemId: number
    imageId: number
    imageTitle: string
    price: number
    quantity: number
}

export interface Cart {
    userId: number
    cartItems: CartItem[]
    totalPrice: number
}

export interface CreateCartItemDto {
    imageId: number
    quantity: number
}

export interface UpdateCartItemDto {
    cartItemId: number
    quantity: number
}

export interface ApiResponse<T> {
    isSuccess: boolean
    message: string
    data: T
}

// Cart Service
export const cartService = {
    // Get current user's cart
    getMyCart: async (): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.get<ApiResponse<Cart>>("/carts/me")
        return response.data
    },

    // Add item to cart
    addToCart: async (dto: CreateCartItemDto): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.post<ApiResponse<Cart>>("/carts", dto)
        return response.data
    },

    // Update cart item quantity
    updateCartItem: async (dto: UpdateCartItemDto): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.put<ApiResponse<Cart>>("/carts/me", dto)
        return response.data
    },

    // Remove item from cart
    removeCartItem: async (cartItemId: number): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.delete<ApiResponse<Cart>>(`/carts/me/${cartItemId}`)
        return response.data
    },
}

