"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, useState } from "react"
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
    // Initialize state from localStorage if available
    const [mounted, setMounted] = useState(false)
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        isOpen: false,
    })

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            const { items } = JSON.parse(savedCart)
            items.forEach((item: CartItem) => {
                dispatch({ type: "ADD_ITEM", payload: { artwork: item, quantity: item.quantity } })
            })
        }
        setMounted(true)
    }, [])

    // Save cart to localStorage when it changes
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("cart", JSON.stringify({ items: state.items }))
        }
    }, [state.items, mounted])

    const addItem = (artwork: Artwork, quantity = 1) => {
        dispatch({ type: "ADD_ITEM", payload: { artwork, quantity } })
    }

    const removeItem = (artworkId: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: artworkId })
    }

    const updateQuantity = (artworkId: string, quantity: number) => {
        if (quantity === 0) {
            removeItem(artworkId)
        } else {
            dispatch({ type: "UPDATE_QUANTITY", payload: { id: artworkId, quantity } })
        }
    }

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" })
    }

    const toggleCart = () => {
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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

