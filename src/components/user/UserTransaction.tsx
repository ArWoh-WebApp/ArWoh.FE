"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for transactions
const transactions = [
    {
        id: 1,
        artwork: {
            title: "Abstract Harmony",
            image: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=1942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        price: 1500000,
        status: "completed",
        date: "2024-02-20T10:00:00Z",
    },
    {
        id: 2,
        artwork: {
            title: "Urban Dreams",
            image: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        price: 2300000,
        status: "pending",
        date: "2024-02-18T15:30:00Z",
    },
    {
        id: 3,
        artwork: {
            title: "Nature's Whisper",
            image: "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        price: 1800000,
        status: "completed",
        date: "2024-02-15T09:15:00Z",
    },
]

export function UserTransactions() {
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-white/5">
                <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-white/60">
                    <div>Artwork</div>
                    <div>Title</div>
                    <div className="text-right">Price</div>
                    <div className="text-center">Status</div>
                    <div className="text-right">Date</div>
                </div>
                <div className="divide-y divide-white/10">
                    {transactions.map((transaction, index) => (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-5 items-center gap-4 p-4"
                        >
                            <div>
                                <img
                                    src={transaction.artwork.image || "/placeholder.svg"}
                                    alt={transaction.artwork.title}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                            </div>
                            <div className="font-medium text-white">{transaction.artwork.title}</div>
                            <div className="text-right font-medium text-white">{transaction.price.toLocaleString("vi-VN")} ₫</div>
                            <div className="text-center">
                                <span
                                    className={cn(
                                        "inline-block rounded-full px-2 py-1 text-xs font-medium",
                                        transaction.status === "completed"
                                            ? "bg-green-500/10 text-green-500"
                                            : "bg-yellow-500/10 text-yellow-500",
                                    )}
                                >
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="text-right text-sm text-white/60">
                                {format(new Date(transaction.date), "MMM d, yyyy")}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

