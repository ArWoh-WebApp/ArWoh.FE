"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, Loader2, ArrowLeft, AlertTriangle } from "lucide-react"
import { paymentService, type PaymentDetail } from "@/api/payment"
import { Button } from "@/components/ui/button"

export default function PaymentSuccess() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                // First, get the most recent transaction
                const transactionsResponse = await paymentService.getUserTransactions({
                    status: "PENDING", // Get the most recent pending transaction
                })

                if (!transactionsResponse.isSuccess || !transactionsResponse.data.length) {
                    setError("No recent transactions found")
                    setIsLoading(false)
                    return
                }

                // Get the most recent transaction's payment ID
                const mostRecentTransaction = transactionsResponse.data[0]
                const paymentId = mostRecentTransaction.id

                // Now get the payment details which will also update the status in the database
                const paymentResponse = await paymentService.getPaymentById(paymentId)

                if (paymentResponse.isSuccess && paymentResponse.data) {
                    // Check if the payment is completed
                    if (paymentResponse.data.status === "COMPLETED") {
                        setPaymentDetail(paymentResponse.data)
                    } else {
                        setError("Payment has not been completed")
                    }
                } else {
                    setError(paymentResponse.message || "Failed to fetch payment details")
                }
            } catch (error) {
                console.error("Error fetching payment details:", error)
                setError("An error occurred while processing your payment")
            } finally {
                setIsLoading(false)
            }
        }

        fetchPaymentDetails()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                <p className="text-white/60">Processing your payment...</p>
            </div>
        )
    }

    if (error || !paymentDetail) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Payment Not Completed</h1>
                    <p className="text-white/60 mb-6">{error || "Your payment could not be processed"}</p>
                    <Button onClick={() => navigate("/art-gallery")} className="bg-purple-600 hover:bg-purple-700">
                        Return to Gallery
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
            >
                {/* Success Header */}
                <div className="flex items-center justify-center p-4 rounded-lg bg-green-500/10 border-green-500/20 mb-6">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <h1 className="text-xl font-bold ml-2 text-green-500">Payment Successful</h1>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                    <div className="flex justify-between pb-4">
                        <span className="text-white/60">Payment ID</span>
                        <span className="text-white font-medium">#{paymentDetail.paymentId}</span>
                    </div>

                    <div className="flex justify-between border-b border-white/10 pb-4">
                        <span className="text-white/60">Amount</span>
                        <span className="text-white font-medium">{paymentDetail.amount.toLocaleString("vi-VN")} ₫</span>
                    </div>

                    <div className="flex justify-between border-b border-white/10 pb-4">
                        <span className="text-white/60">Date</span>
                        <span className="text-white font-medium">{new Date(paymentDetail.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button
                        onClick={() => navigate("/art-gallery")}
                        variant="outline"
                        className="flex-1 border-white/20 text-black hover:bg-white/90"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery
                    </Button>
                    <Button onClick={() => navigate("/user-profile")} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        View My Purchases
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
