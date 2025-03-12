"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Dummy data - replace with actual API data when available
const data = [
    { month: "Jan", revenue: 2100000 },
    { month: "Feb", revenue: 3200000 },
    { month: "Mar", revenue: 2800000 },
    { month: "Apr", revenue: 4500000 },
    { month: "May", revenue: 3800000 },
    { month: "Jun", revenue: 5200000 },
]

export function PhotographerRevenue() {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
    const averageRevenue = totalRevenue / data.length

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-6"
                >
                    <h3 className="text-sm font-medium text-white/60">Total Revenue</h3>
                    <p className="mt-2 text-2xl font-semibold text-white">{totalRevenue.toLocaleString("vi-VN")} ₫</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-6"
                >
                    <h3 className="text-sm font-medium text-white/60">Average Monthly Revenue</h3>
                    <p className="mt-2 text-2xl font-semibold text-white">{averageRevenue.toLocaleString("vi-VN")} ₫</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-6"
                >
                    <h3 className="text-sm font-medium text-white/60">Total Sales</h3>
                    <p className="mt-2 text-2xl font-semibold text-white">42</p>
                </motion.div>
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg border border-white/10 bg-white/5 p-6"
            >
                <h3 className="mb-6 text-lg font-medium text-white">Revenue Over Time</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} />
                            <YAxis
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: "rgba(255,255,255,0.5)" }}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(0,0,0,0.8)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                                formatter={(value: number) => [`${value.toLocaleString("vi-VN")} ₫`, "Revenue"]}
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
                </div>
            </motion.div>
        </div>
    )
}

