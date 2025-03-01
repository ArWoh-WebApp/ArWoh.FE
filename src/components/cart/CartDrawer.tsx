"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/CardContext"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"

export function CartDrawer() {
    const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCart()
    const [mounted, setMounted] = useState(false)
    const drawerRef = useRef<HTMLDivElement>(null)

    // Handle hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    // Handle clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                toggleCart()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, toggleCart])

    const location = useLocation()
    const hideOnRoutes = ["/login", "/register"]
    const shouldShow = !hideOnRoutes.includes(location.pathname)

    if (!mounted || !shouldShow) return null

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <>
            {/* Cart Toggle Button */}
            <button
                onClick={toggleCart}
                className="fixed right-4 top-28 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black shadow-lg transition-transform hover:scale-105"
            >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">{items.length}</span>
            </button>

            {/* Cart Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, display: "none" }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Cart Panel */}
                        <motion.div
                            ref={drawerRef}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-black"
                        >
                            <div className="flex h-full flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-white/10 p-4">
                                    <h2 className="text-xl font-semibold text-white">Your Cart</h2>
                                    <button
                                        onClick={toggleCart}
                                        className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {items.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-white/60">
                                            <ShoppingCart className="mb-4 h-12 w-12" />
                                            <p>Your cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 20 }}
                                                    className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                                                >
                                                    {/* Item Image */}
                                                    <img
                                                        src={item.src || "/placeholder.svg"}
                                                        alt={item.title}
                                                        className="h-20 w-20 rounded-lg object-cover"
                                                    />

                                                    {/* Item Details */}
                                                    <div className="flex flex-1 flex-col">
                                                        <h3 className="font-medium text-white">{item.title}</h3>
                                                        <p className="text-sm text-white/60">by {item.user.name}</p>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                                    className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="min-w-[2rem] text-center text-white">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Item Price */}
                                                    <div className="text-right">
                                                        <p className="font-medium text-white">
                                                            {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {items.length > 0 && (
                                    <div className="border-t border-white/10 p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-lg font-medium text-white">Total</span>
                                            <span className="text-lg font-medium text-white">{total.toLocaleString("vi-VN")} ₫</span>
                                        </div>
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 text-white transition-transform hover:scale-[1.02]"
                                            onClick={() => {
                                                // Handle checkout
                                            }}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

