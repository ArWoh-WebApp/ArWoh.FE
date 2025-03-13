/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { toast } from "sonner"
import type { Cart, CartItem, CreateCartItemDto, UpdateCartItemDto } from "@/api/cart"
import { cartService } from "@/api/cart"

interface CartContextType {
  cartItems: CartItem[]
  totalPrice: number
  isOpen: boolean
  isLoading: boolean
  addItem: (imageId: number, quantity: number) => Promise<void>
  removeItem: (cartItemId: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  toggleCart: () => void
  isCartEnabled: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if the cart should be enabled for this user
  const isCartEnabled = isAuthenticated && user?.role === "Customer"

  // Fetch cart when authenticated and user has the right role
  useEffect(() => {
    if (isAuthenticated && isCartEnabled) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated, isCartEnabled])

  const fetchCart = async () => {
    try {
      setIsLoading(true)
      const response = await cartService.getMyCart()
      if (response.isSuccess) {
        setCart(response.data)
      }
    } catch (error) {
      toast.error("Failed to fetch cart")
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (imageId: number, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    if (!isCartEnabled) {
      toast.error("Only users can add items to cart")
      return
    }

    try {
      setIsLoading(true)
      const dto: CreateCartItemDto = { imageId, quantity }
      const response = await cartService.addToCart(dto)

      if (response.isSuccess) {
        setCart(response.data)
        toast.success("Item added to cart")
      }
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (cartItemId: number) => {
    if (!isAuthenticated || !cart || !isCartEnabled) return

    try {
      setIsLoading(true)
      const response = await cartService.removeCartItem(cartItemId)
      if (response.isSuccess) {
        setCart(response.data)
        toast.success("Item removed from cart")
      }
    } catch (error) {
      toast.error("Failed to remove item from cart")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!isAuthenticated || !cart || !isCartEnabled) return

    try {
      setIsLoading(true)
      if (quantity === 0) {
        await removeItem(cartItemId)
      } else {
        const dto: UpdateCartItemDto = { cartItemId, quantity }
        const response = await cartService.updateCartItem(dto)
        if (response.isSuccess) {
          setCart(response.data)
          toast.success("Cart updated")
        }
      }
    } catch (error) {
      toast.error("Failed to update cart")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated || !cart || !isCartEnabled) return

    try {
      setIsLoading(true)
      for (const item of cart.cartItems) {
        await cartService.removeCartItem(item.cartItemId)
      }
      setCart(null)
      toast.success("Cart cleared")
    } catch (error) {
      toast.error("Failed to clear cart")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to view your cart")
      return
    }

    if (!isCartEnabled) {
      toast.error("Cart is only available for users")
      return
    }

    setIsOpen(!isOpen)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: cart?.cartItems || [],
        totalPrice: cart?.totalPrice || 0,
        isOpen,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        isCartEnabled,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

