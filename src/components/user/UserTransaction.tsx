/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { paymentService, type PaymentTransaction, type PaymentStatus, type PaymentDetail } from "@/api/payment"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ChevronDown, Filter, LineChart, Eye, Loader2, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
    ResponsiveContainer,
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"
import { toast } from "sonner"

// Status badge colors
const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-500",
    COMPLETED: "bg-green-500/20 text-green-500",
    FAILED: "bg-red-500/20 text-red-500",
    CANCELLED: "bg-gray-500/20 text-gray-400",
    REFUNDED: "bg-blue-500/20 text-blue-400",
    ALL: "bg-purple-500/20 text-purple-500",
}

export function UserTransactions() {
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedTransaction, setSelectedTransaction] = useState<PaymentDetail | null>(null)
    const [isDetailLoading, setIsDetailLoading] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Filter states
    const [statusFilter, setStatusFilter] = useState<PaymentStatus>("ALL")
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    // Chart data 
    const [chartData, setChartData] = useState<any[]>([])

    const [isCancelling, setIsCancelling] = useState(false)
    // First, add a new state for the cancellation reason
    const [cancelReason, setCancelReason] = useState<string>("Cancelled by user")

    // Fetch transactions with filters
    const fetchTransactions = async () => {
        try {
            setIsLoading(true)

            // Prepare filter parameters
            const params: {
                status?: PaymentStatus
                fromDate?: string
                toDate?: string
            } = {}

            if (statusFilter !== "ALL") {
                params.status = statusFilter
            }

            if (dateRange?.from) {
                params.fromDate = format(dateRange.from, "yyyy-MM-dd")
            }

            if (dateRange?.to) {
                params.toDate = format(dateRange.to, "yyyy-MM-dd")
            }

            const response = await paymentService.getUserTransactions(params)

            if (response.isSuccess) {
                setTransactions(response.data)

                // Prepare chart data
                const chartData = prepareChartData(response.data)
                setChartData(chartData)
            } else {
                setError(response.message || "Failed to load transactions")
            }
        } catch (err) {
            setError("Failed to load transactions")
        } finally {
            setIsLoading(false)
        }
    }

    // Prepare chart data from transactions
    const prepareChartData = (transactions: PaymentTransaction[]) => {
        // Group transactions by date
        const groupedByDate = transactions.reduce(
            (acc, transaction) => {
                const date = format(new Date(transaction.createdAt), "MMM dd")

                if (!acc[date]) {
                    acc[date] = {
                        date,
                        amount: 0,
                        count: 0,
                    }
                }

                acc[date].amount += transaction.amount
                acc[date].count += 1

                return acc
            },
            {} as Record<string, { date: string; amount: number; count: number }>,
        )

        // Convert to array and sort by date
        return Object.values(groupedByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    // View transaction details
    const viewTransactionDetails = async (transactionId: number) => {
        try {
            setIsDetailLoading(true)
            const response = await paymentService.getPaymentById(transactionId)

            if (response.isSuccess) {
                setSelectedTransaction(response.data)
                setIsDetailOpen(true)
            } else {
                setError(response.message || "Failed to load transaction details")
            }
        } catch (err) {
            setError("Failed to load transaction details")
        } finally {
            setIsDetailLoading(false)
        }
    }

    // Replace the handleCancelPayment function with this updated version
    const handleCancelPayment = async () => {
        if (!selectedTransaction) return

        try {
            setIsCancelling(true)
            const response = await paymentService.cancelPayment(selectedTransaction.paymentId, cancelReason)

            if (response.isSuccess) {
                // First close the detail dialog
                setIsDetailOpen(false)

                // Clear the selected transaction
                setSelectedTransaction(null)

                // Show success message
                toast.success("Payment cancelled successfully")

                // Reset the cancel reason to default
                setCancelReason("Cancelled by user")

                // Add a slight delay before refreshing data to ensure UI cleanup completes
                setTimeout(() => {
                    fetchTransactions()
                }, 100)
            } else {
                toast.error(response.message || "Failed to cancel payment")
            }
        } catch (error) {
            console.error("Error cancelling payment:", error)
            toast.error("An error occurred while cancelling the payment")
        } finally {
            setIsCancelling(false)
        }
    }

    // Add proper cleanup when closing the detail dialog
    const handleDetailDialogChange = (open: boolean) => {
        setIsDetailOpen(open)
        if (!open) {
            setTimeout(() => {
                setSelectedTransaction(null)
            }, 300)
        }
    }

    // Apply filters
    useEffect(() => {
        fetchTransactions()
    }, [statusFilter, dateRange])

    // Reset date filter
    const resetDateFilter = () => {
        setDateRange(undefined)
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Skeleton for filters */}
                <div className="flex justify-between mb-6">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-48" />
                </div>

                {/* Skeleton for chart */}
                <Skeleton className="h-64 w-full rounded-lg mb-6" />

                {/* Skeleton for table */}
                <div className="rounded-lg border border-white/10 bg-white/5">
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-white/60">
                        <div>ID</div>
                        <div className="text-right">Amount</div>
                        <div className="text-center">Status</div>
                        <div className="text-right">Date</div>
                        <div className="text-center">Actions</div>
                    </div>
                    <div className="divide-y divide-white/10">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="grid grid-cols-5 items-center gap-4 p-4">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24 justify-self-end" />
                                <Skeleton className="h-6 w-20 justify-self-center rounded-full" />
                                <Skeleton className="h-4 w-28 justify-self-end" />
                                <Skeleton className="h-4 w-8 justify-self-center" />
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
            <div className="flex flex-col min-h-[200px] items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4 text-white">
                <p className="mb-4">No transactions found</p>
                {(statusFilter !== "ALL" || dateRange) && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setStatusFilter("ALL")
                            setDateRange(undefined)
                        }}
                        className="text-black"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6 mb-32">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-white/10 bg-white/5">
                            <Filter className="mr-2 h-4 w-4" />
                            Status: {statusFilter === "ALL" ? "All" : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black border-white/10 divide-y divide-white/20">
                        <DropdownMenuItem
                            className={cn(
                                "cursor-pointer text-white hover:text-black hover:bg-white/80 transition-colors",
                                statusFilter === "ALL" && "bg-white/10",
                            )}
                            onClick={() => setStatusFilter("ALL")}
                        >
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn(
                                "cursor-pointer text-white hover:text-black hover:bg-white/80 transition-colors",
                                statusFilter === "COMPLETED" && "bg-white/10",
                            )}
                            onClick={() => setStatusFilter("COMPLETED")}
                        >
                            Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn(
                                "cursor-pointer text-white hover:text-black hover:bg-white/80 transition-colors",
                                statusFilter === "PENDING" && "bg-white/10",
                            )}
                            onClick={() => setStatusFilter("PENDING")}
                        >
                            Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn(
                                "cursor-pointer text-white hover:text-black hover:bg-white/80 transition-colors",
                                statusFilter === "FAILED" && "bg-white/10",
                            )}
                            onClick={() => setStatusFilter("FAILED")}
                        >
                            Failed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn(
                                "cursor-pointer text-white hover:text-black hover:bg-white/80 transition-colors",
                                statusFilter === "CANCELLED" && "bg-white/10",
                            )}
                            onClick={() => setStatusFilter("CANCELLED")}
                        >
                            Cancelled
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex gap-2">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-white/10 bg-white/5">
                                <Calendar className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    "Date Range"
                                )}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-black border-white/10" align="end">
                            <CalendarComponent
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="bg-black text-white"
                            />
                            <div className="flex items-center justify-end gap-2 p-3 border-t border-white/10">
                                <Button variant="outline" size="sm" onClick={resetDateFilter} className="border-white/10 bg-white/5">
                                    Reset
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Apply
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 mb-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <LineChart className="mr-2 h-5 w-5 text-purple-500" />
                        Transaction History
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: "rgba(255, 255, 255, 0.5)" }} />
                                <YAxis
                                    stroke="rgba(255, 255, 255, 0.5)"
                                    tick={{ fill: "rgba(255, 255, 255, 0.5)" }}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k ₫`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
                                    formatter={(value: number, name: string) => [
                                        name === "amount" ? `${value.toLocaleString("vi-VN")} ₫` : value,
                                        name === "amount" ? "Amount" : "Count",
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#9333ea"
                                    strokeWidth={2}
                                    dot={{ fill: "#9333ea" }}
                                    activeDot={{ r: 8 }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa" }} />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="rounded-lg border border-white/10 bg-white/5">
                <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-white/60">
                    <div>ID</div>
                    <div className="text-right">Amount</div>
                    <div className="text-center">Status</div>
                    <div className="text-right">Date</div>
                    <div className="text-center">Actions</div>
                </div>
                <div className="divide-y divide-white/10">
                    {transactions.map((transaction, index) => (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="grid grid-cols-5 items-center gap-4 p-4"
                        >
                            <div className="font-medium text-white">#{transaction.id}</div>
                            <div className="text-right font-medium text-white">{transaction.amount.toLocaleString("vi-VN")} ₫</div>
                            <div className="text-center">
                                <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColors[transaction.status]}`}
                                >
                                    {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                                </span>
                            </div>
                            <div className="text-right text-white/80">{format(new Date(transaction.createdAt), "MMM dd, yyyy")}</div>
                            <div className="text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/60 hover:text-white hover:bg-white/10"
                                    onClick={() => viewTransactionDetails(transaction.id)}
                                    disabled={isDetailLoading}
                                >
                                    {isDetailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Transaction Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={handleDetailDialogChange}>
                <DialogContent className="bg-black border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-white/60">Payment ID</span>
                                <span className="text-white font-medium">#{selectedTransaction.paymentId}</span>
                            </div>

                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-white/60">Amount</span>
                                <span className="text-white font-medium">{selectedTransaction.amount.toLocaleString("vi-VN")} ₫</span>
                            </div>

                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-white/60">Status</span>
                                <span className={`font-medium ${statusColors[selectedTransaction.status]}`}>
                                    {selectedTransaction.status.charAt(0) + selectedTransaction.status.slice(1).toLowerCase()}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-white/60">Created At</span>
                                <span className="text-white font-medium">
                                    {format(new Date(selectedTransaction.createdAt), "PPpp")}
                                </span>
                            </div>

                            {selectedTransaction.updatedAt && (
                                <div className="flex justify-between pb-4">
                                    <span className="text-white/60">Updated At</span>
                                    <span className="text-white font-medium">
                                        {format(new Date(selectedTransaction.updatedAt), "PPpp")}
                                    </span>
                                </div>
                            )}

                            {selectedTransaction.status === "PENDING" && (
                                <div className="pt-4 pb-2 space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="cancelReason" className="text-sm text-white/60">
                                            Cancellation Reason
                                        </label>
                                        <textarea
                                            id="cancelReason"
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter reason for cancellation"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button
                                            className="flex-1 bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                                            onClick={handleCancelPayment}
                                            disabled={isCancelling || !cancelReason.trim()}
                                        >
                                            {isCancelling ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Ban className="h-4 w-4 mr-2" />
                                            )}
                                            Cancel Payment
                                        </Button>
                                        {selectedTransaction.paymentUrl && (
                                            <Button
                                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                                onClick={() => window.open(selectedTransaction.paymentUrl, "_blank")}
                                            >
                                                View Payment Page
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
