"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { photographerService, type RevenueData } from "@/api/photographer"
import { Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export function PhotographerRevenue() {
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                setIsLoading(true)
                const response = await photographerService.getPhotographerRevenue()
                if (response.isSuccess) {
                    setRevenueData(response.data)
                } else {
                    toast.error(response.message || "Failed to load revenue data")
                }
            } catch (error) {
                console.error("Error fetching revenue data:", error)
                toast.error("An error occurred while loading revenue data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchRevenueData()
    }, [])

    // Prepare chart data from image sales
    const prepareChartData = () => {
        if (!revenueData?.imageSales) return []

        // Group by image and create data points
        return revenueData.imageSales.map((sale) => ({
            name: sale.imageTitle,
            revenue: sale.totalAmount,
            sales: sale.salesCount,
        }))
    }

    if (isLoading) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-6"
                >
                    <h3 className="text-sm font-medium text-white/60">Total Revenue</h3>
                    <p className="mt-2 text-2xl font-semibold text-white">
                        {revenueData?.totalRevenue.toLocaleString("vi-VN") || 0} ₫
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-6"
                >
                    <h3 className="text-sm font-medium text-white/60">Total Images Sold</h3>
                    <p className="mt-2 text-2xl font-semibold text-white">{revenueData?.totalImagesSold || 0}</p>
                </motion.div>
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg border border-white/10 bg-white/5 p-6"
            >
                <h3 className="mb-6 text-lg font-medium text-white">Revenue by Image</h3>
                <div className="h-[300px]">
                    {revenueData?.imageSales && revenueData.imageSales.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={prepareChartData()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="rgba(255,255,255,0.5)"
                                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                                    tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.5)"
                                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k ₫`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                                    formatter={(value: number, name: string) => [
                                        name === "revenue" ? `${value.toLocaleString("vi-VN")} ₫` : value,
                                        name === "revenue" ? "Revenue" : "Sales",
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#9333ea"
                                    strokeWidth={2}
                                    dot={{ fill: "#9333ea" }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-white/60">No revenue data available</div>
                    )}
                </div>
            </motion.div>

            {/* Sales Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg border border-white/10 bg-white/5 p-6"
            >
                <h3 className="mb-6 text-lg font-medium text-white">Sales Details</h3>

                {revenueData?.imageSales && revenueData.imageSales.length > 0 ? (
                    <div className="space-y-4">
                        {revenueData.imageSales.map((sale) => (
                            <motion.div
                                key={sale.imageId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                            >
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                    {sale.imageUrl ? (
                                        <img
                                            src={sale.imageUrl || "/placeholder.svg"}
                                            alt={sale.imageTitle}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-800">
                                            <ImageIcon className="h-8 w-8 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-medium text-white">{sale.imageTitle}</h4>
                                    <div className="mt-1 flex items-center gap-4">
                                        <span className="text-sm text-white/60">
                                            {sale.salesCount} {sale.salesCount === 1 ? "sale" : "sales"}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-white">{sale.totalAmount.toLocaleString("vi-VN")} ₫</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-32 items-center justify-center text-white/60">No sales data available</div>
                )}
            </motion.div>
        </div>
    )
}

