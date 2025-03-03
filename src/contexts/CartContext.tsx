/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { toast } from "sonner"
import type { Cart, CartItem, CreateCartItemDto } from "@/api/cart"
import { cartService } from "@/api/cart"

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  addItem: (artworkId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

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

  const addItem = async (artworkId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    try {
      setIsLoading(true)
      const item: CreateCartItemDto = { artworkId, quantity }

      if (!cart) {
        // Create new cart if it doesn't exist
        const response = await cartService.createCart([item])
        if (response.isSuccess) {
          setCart(response.data)
          toast.success("Item added to cart")
        }
      } else {
        // Update existing cart
        const response = await cartService.updateCartItem(artworkId, { quantity })
        if (response.isSuccess) {
          setCart(response.data)
          toast.success("Cart updated")
        }
      }
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!isAuthenticated || !cart) return

    try {
      setIsLoading(true)
      const response = await cartService.deleteCartItem(itemId)
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

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isAuthenticated || !cart) return

    try {
      setIsLoading(true)
      if (quantity === 0) {
        await removeItem(itemId)
      } else {
        const response = await cartService.updateCartItem(itemId, { quantity })
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
    if (!isAuthenticated || !cart) return

    try {
      setIsLoading(true)
      for (const item of cart.items) {
        await cartService.deleteCartItem(item.id)
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
    setIsOpen(!isOpen)
  }

  return (
    <CartContext.Provider
      value={{
        items: cart?.items || [],
        isOpen,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
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

