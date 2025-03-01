"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { toast } from "sonner"
import type { Artwork } from "@/mock/artworkInterface"

interface CartItem extends Artwork {
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { artwork: Artwork; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }

interface CartContextType extends CartState {
  addItem: (artwork: Artwork, quantity?: number) => void
  removeItem: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.artwork.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.artwork.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload.artwork, quantity: action.payload.quantity }],
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart && isAuthenticated) {
      const { items } = JSON.parse(savedCart)
      items.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: { artwork: item, quantity: item.quantity } })
      })
    }
    setMounted(true)
  }, [isAuthenticated])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (mounted && isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify({ items: state.items }))
    }
  }, [state.items, mounted, isAuthenticated])

  const addItem = (artwork: Artwork, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }
    dispatch({ type: "ADD_ITEM", payload: { artwork, quantity } })
    toast.success("Item added to cart")
  }

  const removeItem = (artworkId: string) => {
    if (!isAuthenticated) return
    dispatch({ type: "REMOVE_ITEM", payload: artworkId })
  }

  const updateQuantity = (artworkId: string, quantity: number) => {
    if (!isAuthenticated) return
    if (quantity === 0) {
      removeItem(artworkId)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: artworkId, quantity } })
    }
  }

  const clearCart = () => {
    if (!isAuthenticated) return
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to view your cart")
      return
    }
    dispatch({ type: "TOGGLE_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
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

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
