/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { adminShippingService } from "@/api/admin"
import type { ShippingOrder } from "@/api/userShipping"
import { Loader2, Package, Truck, ChevronRight, X, CheckCircle, Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/ui/stepper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminShipping() {
    // State for shipping orders
    const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([])
    const [isLoadingOrders, setIsLoadingOrders] = useState(true)
    const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([])

    // State for selected order details
    const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null)
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

    // State for status update
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [statusNote, setStatusNote] = useState("")
    const [newStatus, setNewStatus] = useState<string>("")

    // State for proof image upload
    const [isUploadingProof, setIsUploadingProof] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Filter state
    const [statusFilter, setStatusFilter] = useState<string>("All")
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch shipping orders on component mount
    useEffect(() => {
        fetchShippingOrders()
    }, [])

    // Apply filters when orders, statusFilter, or searchQuery changes
    useEffect(() => {
        applyFilters()
    }, [shippingOrders, statusFilter, searchQuery])

    // Function to fetch shipping orders
    const fetchShippingOrders = async () => {
        try {
            setIsLoadingOrders(true)
            const response = await adminShippingService.getAllShippingOrders()
            if (response.isSuccess) {
                setShippingOrders(response.data)
            } else {
                toast.error(response.message || "Failed to load shipping orders")
            }
        } catch (error) {
            console.error("Error fetching shipping orders:", error)
            toast.error("An error occurred while loading shipping orders")
        } finally {
            setIsLoadingOrders(false)
        }
    }

    // Function to apply filters
    const applyFilters = () => {
        let filtered = [...shippingOrders]

        // Apply status filter
        if (statusFilter !== "All") {
            filtered = filtered.filter((order) => order.shippingStatus === statusFilter)
        }

        // Apply search filter (case insensitive)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.customerName?.toLowerCase().includes(query) ||
                    order.customerEmail?.toLowerCase().includes(query) ||
                    order.shippingAddress.toLowerCase().includes(query) ||
                    order.orderId.toString().includes(query),
            )
        }

        setFilteredOrders(filtered)
    }

    // Function to view order details
    const viewOrderDetails = (order: ShippingOrder) => {
        setSelectedOrder(order)
        setIsOrderDetailsOpen(true)

        // Reset status update form
        setNewStatus("")
        setStatusNote("")

        // Reset proof image form
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    // Function to get next possible status
    const getNextPossibleStatus = (currentStatus: string): string => {
        switch (currentStatus) {
            case "Pending":
                return "Confirmed"
            case "Confirmed":
                return "Packaging"
            case "Packaging":
                return "Shipping"
            case "Shipping":
                return "Delivered"
            default:
                return ""
        }
    }

    // Function to update shipping status
    const updateShippingStatus = async () => {
        if (!selectedOrder || !newStatus || !statusNote.trim()) {
            toast.error("Please select a status and enter a note")
            return
        }

        try {
            setIsUpdatingStatus(true)
            const response = await adminShippingService.updateShippingStatus(selectedOrder.orderId, {
                status: newStatus as any,
                note: statusNote,
            })

            if (response.isSuccess) {
                toast.success(`Order status updated to ${newStatus}`)

                // Update the orders list
                setShippingOrders((prevOrders) =>
                    prevOrders.map((order) => (order.orderId === selectedOrder.orderId ? response.data : order)),
                )

                // Update the selected order
                setSelectedOrder(response.data)

                // Reset form
                setNewStatus("")
                setStatusNote("")
            } else {
                toast.error(response.message || "Failed to update status")
            }
        } catch (error) {
            console.error("Error updating shipping status:", error)
            toast.error("An error occurred while updating the status")
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    // Function to handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)

            // Create preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Function to upload proof image
    const uploadProofImage = async () => {
        if (!selectedOrder || !selectedFile) {
            toast.error("Please select an image file")
            return
        }

        try {
            setIsUploadingProof(true)
            const response = await adminShippingService.uploadDeliveryProof(selectedOrder.orderId, selectedFile)

            if (response.isSuccess) {
                toast.success("Delivery proof image uploaded successfully")

                // Update the orders list
                setShippingOrders((prevOrders) =>
                    prevOrders.map((order) => (order.orderId === selectedOrder.orderId ? response.data : order)),
                )

                // Update the selected order
                setSelectedOrder(response.data)

                // Reset form
                setSelectedFile(null)
                setPreviewUrl(null)
            } else {
                toast.error(response.message || "Failed to upload proof image")
            }
        } catch (error) {
            console.error("Error uploading proof image:", error)
            toast.error("An error occurred while uploading the proof image")
        } finally {
            setIsUploadingProof(false)
        }
    }

    // Function to get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        Pending
                    </Badge>
                )
            case "Confirmed":
                return (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Confirmed
                    </Badge>
                )
            case "Packaging":
                return (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                        Packaging
                    </Badge>
                )
            case "Shipping":
                return (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Shipping
                    </Badge>
                )
            case "Delivered":
                return (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Delivered
                    </Badge>
                )
            case "Cancelled":
                return (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Cancelled
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    // Function to get active step index based on shipping status
    const getActiveStepIndex = (status: string) => {
        switch (status) {
            case "Pending":
                return 0
            case "Confirmed":
                return 1
            case "Packaging":
                return 2
            case "Shipping":
                return 3
            case "Delivered":
                return 4
            case "Cancelled":
                return -1
            default:
                return 0
        }
    }

    // Check if proof image upload is allowed
    const canUploadProofImage = (status: string) => {
        return status === "Shipping" || status === "Delivered"
    }

    return (
        <div className="space-y-6 min-h-[calc(100vh-16rem)]">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">Shipping Orders Management</h2>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search input */}
                    <div className="relative">
                        <Input
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 bg-white/5 border-white/10 text-white"
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Status filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-white/10 divide-y divide-white/20">
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Packaging">Packaging</SelectItem>
                            <SelectItem value="Shipping">Shipping</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Refresh button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10 text-black hover:bg-white/10 hover:text-white"
                        onClick={fetchShippingOrders}
                    >
                        <Loader2 className={cn("h-4 w-4", isLoadingOrders && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Orders List */}
            {isLoadingOrders ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-lg bg-white/5 p-6">
                    <Truck className="h-16 w-16 text-white/30 mb-4" />
                    <h3 className="text-xl font-medium text-white">No Orders Found</h3>
                    <p className="text-white/60 text-center mt-2">
                        {statusFilter !== "All" || searchQuery
                            ? "Try changing your filters or search query"
                            : "There are no shipping orders in the system yet"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.orderId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-white/10 rounded-lg bg-white/5 p-4 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">Order #{order.orderId}</span>
                                        {getStatusBadge(order.shippingStatus)}
                                    </div>
                                    <p className="text-sm text-white/60 mt-1">Created: {format(new Date(order.createdAt), "PPp")}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-white/60">Customer</p>
                                        <p className="font-semibold text-white">{order.customerName || "Unknown"}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-white/60">Total Amount</p>
                                        <p className="font-semibold text-white">{order.totalAmount.toLocaleString("vi-VN")} ₫</p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/10 text-black hover:bg-white/10 hover:text-white"
                                        onClick={() => viewOrderDetails(order)}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        Manage
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-white/60" />
                                    <span className="text-sm text-white/60">
                                        {order.orderDetails.length} {order.orderDetails.length === 1 ? "item" : "items"}
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {order.orderDetails.slice(0, 3).map((detail) => (
                                        <div key={detail.orderDetailId} className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded overflow-hidden">
                                                <img
                                                    src={detail.imageUrl || "/placeholder.svg"}
                                                    alt={detail.imageTitle}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-sm text-white truncate max-w-[150px]">{detail.imageTitle}</span>
                                        </div>
                                    ))}

                                    {order.orderDetails.length > 3 && (
                                        <span className="text-sm text-white/60">+{order.orderDetails.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Order Details Dialog */}
            <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
                <DialogContent className="bg-black border-white/10 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Order Management</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="flex-1 overflow-y-auto pr-4 max-h-[calc(80vh-8rem)]">
                            <div className="space-y-6 py-4">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            Order #{selectedOrder.orderId}
                                            {getStatusBadge(selectedOrder.shippingStatus)}
                                        </h3>
                                        <p className="text-sm text-white/60 mt-1">
                                            Created: {format(new Date(selectedOrder.createdAt), "PPp")}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-white/60">Total Amount</p>
                                        <p className="font-semibold text-white text-lg">
                                            {selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                                    <h4 className="text-sm font-medium text-white/60 mb-3">Customer Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-white/60">Name</p>
                                            <p className="text-white">{selectedOrder.customerName || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/60">Email</p>
                                            <p className="text-white">{selectedOrder.customerEmail || "N/A"}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-white/60">Shipping Address</p>
                                            <p className="text-white">{selectedOrder.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Stepper for Shipping Status */}
                                <div className="bg-black/50 rounded-xl p-6 border border-white/10">
                                    <h4 className="text-sm font-medium text-white/60 mb-6">Shipping Status</h4>

                                    {selectedOrder.shippingStatus === "Cancelled" ? (
                                        <div className="flex flex-col items-center justify-center py-4">
                                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                                                <X className="h-6 w-6 text-red-500" />
                                            </div>
                                            <p className="text-red-500 font-medium">Order Cancelled</p>
                                        </div>
                                    ) : (
                                        <Stepper
                                            steps={[
                                                { id: 1, label: "Pending", icon: <span>1</span> },
                                                { id: 2, label: "Confirmed", icon: <span>2</span> },
                                                { id: 3, label: "Packaging", icon: <span>3</span> },
                                                { id: 4, label: "Shipping", icon: <span>4</span> },
                                                { id: 5, label: "Delivered", icon: <CheckCircle className="h-4 w-4" /> },
                                            ]}
                                            activeStep={getActiveStepIndex(selectedOrder.shippingStatus)}
                                            colorScheme="cyan"
                                            className="w-full"
                                        />
                                    )}
                                </div>

                                {/* Status Update Form */}
                                {selectedOrder.shippingStatus !== "Delivered" && selectedOrder.shippingStatus !== "Cancelled" && (
                                    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                                        <h4 className="text-sm font-medium text-white/60 mb-3">Update Status</h4>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="newStatus" className="text-white">New Status</Label>
                                                <Select value={newStatus} onValueChange={setNewStatus}>
                                                    <SelectTrigger id="newStatus" className="bg-white/5 border-white/10 text-white">
                                                        <SelectValue placeholder="Select new status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-black text-white border-white/10">
                                                        <SelectItem value={getNextPossibleStatus(selectedOrder.shippingStatus)}>
                                                            {getNextPossibleStatus(selectedOrder.shippingStatus)}
                                                        </SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="statusNote" className="text-white">Status Note</Label>
                                                <Textarea
                                                    id="statusNote"
                                                    placeholder="Enter a note for this status update"
                                                    value={statusNote}
                                                    onChange={(e) => setStatusNote(e.target.value)}
                                                    className="min-h-[80px] bg-white/5 border-white/10 text-white"
                                                />
                                            </div>

                                            <Button
                                                onClick={updateShippingStatus}
                                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                                disabled={isUpdatingStatus || !newStatus || !statusNote.trim()}
                                            >
                                                {isUpdatingStatus ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    "Update Status"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Proof Image Upload */}
                                {canUploadProofImage(selectedOrder.shippingStatus) && (
                                    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                                        <h4 className="text-sm font-medium text-white/60 mb-3">Upload Delivery Proof</h4>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="proofImage">Proof Image</Label>
                                                <div
                                                    className={cn(
                                                        "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                                                        selectedFile ? "border-cyan-500/50" : "border-white/20 hover:border-white/40",
                                                    )}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <input
                                                        ref={fileInputRef}
                                                        id="proofImage"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />

                                                    {previewUrl ? (
                                                        <div className="space-y-2">
                                                            <img
                                                                src={previewUrl || "/placeholder.svg"}
                                                                alt="Preview"
                                                                className="max-h-[200px] mx-auto rounded-lg"
                                                            />
                                                            <p className="text-sm text-white/60">Click to change image</p>
                                                        </div>
                                                    ) : (
                                                        <div className="py-8 flex flex-col items-center">
                                                            <Camera className="h-10 w-10 text-white/40 mb-2" />
                                                            <p className="text-white/60">Click to select an image</p>
                                                            <p className="text-sm text-white/40 mt-1">PNG, JPG or WEBP</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={uploadProofImage}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                disabled={isUploadingProof || !selectedFile}
                                            >
                                                {isUploadingProof ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Upload Proof Image
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Existing Proof Image */}
                                {selectedOrder.deliveryProofImageUrl && (
                                    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                                        <h4 className="text-sm font-medium text-white/60 mb-3">Delivery Proof Image</h4>
                                        <img
                                            src={selectedOrder.deliveryProofImageUrl || "/placeholder.svg"}
                                            alt="Delivery Proof"
                                            className="w-full max-h-[300px] object-contain rounded-lg"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-white/60">Order Items</h4>
                                    <div className="bg-white/5 rounded-md border border-white/10 divide-y divide-white/10">
                                        {selectedOrder.orderDetails.map((detail) => (
                                            <div key={detail.orderDetailId} className="p-4 flex gap-4">
                                                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={detail.imageUrl || "/placeholder.svg"}
                                                        alt={detail.imageTitle}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-white">{detail.imageTitle}</h4>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-sm text-white/60">Quantity: {detail.quantity}</span>
                                                        <span className="font-semibold text-white">{detail.price.toLocaleString("vi-VN")} ₫</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/60">Original Price:</span>
                                        <span className="text-white">{selectedOrder.originalPrice.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/60">Shipping Fee:</span>
                                        <span className="text-white">{selectedOrder.shippingFee.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                    <div className="flex justify-between items-center font-semibold">
                                        <span className="text-white">Total:</span>
                                        <span className="text-white text-lg">{selectedOrder.totalAmount.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-4">
                                    {selectedOrder.confirmNote && (
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium text-white/60">Confirmation Note</h4>
                                            <p className="text-sm text-white bg-white/5 p-3 rounded-md border border-white/10">
                                                {selectedOrder.confirmNote}
                                            </p>
                                        </div>
                                    )}

                                    {selectedOrder.packagingNote && (
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium text-white/60">Packaging Note</h4>
                                            <p className="text-sm text-white bg-white/5 p-3 rounded-md border border-white/10">
                                                {selectedOrder.packagingNote}
                                            </p>
                                        </div>
                                    )}

                                    {selectedOrder.shippingNote && (
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium text-white/60">Shipping Note</h4>
                                            <p className="text-sm text-white bg-white/5 p-3 rounded-md border border-white/10">
                                                {selectedOrder.shippingNote}
                                            </p>
                                        </div>
                                    )}

                                    {selectedOrder.deliveryNote && (
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium text-white/60">Delivery Note</h4>
                                            <p className="text-sm text-white bg-white/5 p-3 rounded-md border border-white/10">
                                                {selectedOrder.deliveryNote}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsOrderDetailsOpen(false)}
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
