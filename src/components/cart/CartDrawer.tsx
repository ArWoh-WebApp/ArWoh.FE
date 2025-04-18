/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, Trash2, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { paymentService } from "@/api/payment"
import { toast } from "sonner"

export function CartDrawer() {
    const { cartItems, totalPrice, isOpen, toggleCart, removeItem, updateQuantity } = useCart()
    const [mounted, setMounted] = useState(false)
    const drawerRef = useRef<HTMLDivElement>(null)
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const location = useLocation()

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

    // Check if we should show the cart button (only on art-gallery page)
    const hideOnRoutes = ["/login", "/register"]
    const showCartButton = location.pathname === "/art-gallery" && !hideOnRoutes.includes(location.pathname)

    // Check if we should render the component at all
    const shouldRender = !hideOnRoutes.includes(location.pathname)

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true)
            const response = await paymentService.createPaymentLink()
            if (response.isSuccess && response.data) {
                // Redirect to the payment URL
                window.location.href = response.data
            } else {
                toast.error(response.message || "Failed to create payment link")
            }
        } catch (error) {
            toast.error("Failed to process checkout. Please try again.")
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (!mounted || !shouldRender) return null

    return (
        <>
            {/* Cart Toggle Button - Only show on art-gallery page */}
            {showCartButton && (
                <button
                    onClick={toggleCart}
                    className="fixed right-4 top-28 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black shadow-lg transition-transform hover:scale-105"
                >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-medium">{cartItems.length}</span>
                </button>
            )}

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
                                    {cartItems.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-white/60">
                                            <ShoppingCart className="mb-4 h-12 w-12" />
                                            <p>Your cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <motion.div
                                                    key={item.cartItemId}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 20 }}
                                                    className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                                                >
                                                    {/* Item Image */}
                                                    <div className="h-20 w-20 rounded-lg bg-gray-800 flex items-center justify-center">
                                                        <ShoppingCart className="h-8 w-8 text-gray-500" />
                                                    </div>

                                                    {/* Item Details */}
                                                    <div className="flex flex-1 flex-col">
                                                        <h3 className="font-medium text-white">{item.imageTitle}</h3>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.cartItemId, Math.max(0, item.quantity - 1))}
                                                                    className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="min-w-[2rem] text-center text-white">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                                    className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.cartItemId)}
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
                                {cartItems.length > 0 && (
                                    <div className="border-t border-white/10 p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-lg font-medium text-white">Total</span>
                                            <span className="text-lg font-medium text-white">{totalPrice.toLocaleString("vi-VN")} ₫</span>
                                        </div>
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
                                            onClick={handleCheckout}
                                            disabled={isCheckingOut}
                                        >
                                            {isCheckingOut ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </div>
                                            ) : (
                                                "Proceed to Checkout"
                                            )}
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
