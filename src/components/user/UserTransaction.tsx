/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { UserService } from "@/api/user"
import { Skeleton } from "@/components/ui/skeleton"

export function UserTransactions() {
    const [transactions, setTransactions] = useState<UserService.Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await UserService.getUserTransactions()
                if (response.isSuccess) {
                    setTransactions(response.data)
                } else {
                    setError(response.message)
                }
            } catch (err) {
                setError("Failed to load transactions")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    if (isLoading) {
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
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="grid grid-cols-5 items-center gap-4 p-4">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24 justify-self-end" />
                                <Skeleton className="h-6 w-20 justify-self-center rounded-full" />
                                <Skeleton className="h-4 w-28 justify-self-end" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4 text-white">
                <p>{error}</p>
            </div>
        )
    }

    if (transactions.length === 0) {
        return (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4 text-white">
                <p>No transactions found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-white/5">
                <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-white/60">
                    <div>Artwork</div>
                    <div>Title</div>
                    <div className="text-right">Price</div>
                    <div className="text-center">Location</div>
                    <div className="text-right">Tags</div>
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
                                    src={transaction.url || "/placeholder.svg"}
                                    alt={transaction.title}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                            </div>
                            <div className="font-medium text-white">{transaction.title}</div>
                            <div className="text-right font-medium text-white">{transaction.price.toLocaleString("vi-VN")} ₫</div>
                            <div className="text-center">
                                <span className="inline-block rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-500">
                                    {transaction.location}
                                </span>
                            </div>
                            <div className="flex justify-end gap-1">
                                {transaction.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-block rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {transaction.tags.length > 2 && (
                                    <span className="inline-block rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white">
                                        +{transaction.tags.length - 2}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

