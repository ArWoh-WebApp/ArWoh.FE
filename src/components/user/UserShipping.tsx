"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { shippingService, type ShippableImage, type ShippingOrder } from "@/api/userShipping"
import { Loader2, Package, Truck, ChevronRight, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Stepper } from "@/components/ui/stepper"

export function UserShipping() {
    // State for shippable images
    const [shippableImages, setShippableImages] = useState<ShippableImage[]>([])
    const [isLoadingImages, setIsLoadingImages] = useState(true)

    // State for shipping orders
    const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([])
    const [isLoadingOrders, setIsLoadingOrders] = useState(true)

    // State for selected order details
    const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null)
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

    // State for create order dialog
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
    const [selectedImageIds, setSelectedImageIds] = useState<number[]>([])
    const [shippingAddress, setShippingAddress] = useState("")
    const [customerNote, setCustomerNote] = useState("")
    const [isCreatingOrder, setIsCreatingOrder] = useState(false)

    // Active tab state
    const [activeTab, setActiveTab] = useState("available")

    // Fetch shippable images on component mount
    useEffect(() => {
        const fetchShippableImages = async () => {
            try {
                setIsLoadingImages(true)
                const response = await shippingService.getShippableImages()
                if (response.isSuccess) {
                    setShippableImages(response.data)
                } else {
                    toast.error(response.message || "Failed to load shippable images")
                }
            } catch (error) {
                console.error("Error fetching shippable images:", error)
                toast.error("An error occurred while loading shippable images")
            } finally {
                setIsLoadingImages(false)
            }
        }

        fetchShippableImages()
    }, [])

    // Fetch shipping orders on component mount and when activeTab changes to "orders"
    useEffect(() => {
        if (activeTab === "orders") {
            fetchShippingOrders()
        }
    }, [activeTab])

    // Function to fetch shipping orders
    const fetchShippingOrders = async () => {
        try {
            setIsLoadingOrders(true)
            const response = await shippingService.getShippingOrders()
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

    // Function to view order details
    const viewOrderDetails = async (orderId: number) => {
        try {
            const response = await shippingService.getShippingOrderById(orderId)
            if (response.isSuccess) {
                setSelectedOrder(response.data)
                setIsOrderDetailsOpen(true)
            } else {
                toast.error(response.message || "Failed to load order details")
            }
        } catch (error) {
            console.error("Error fetching order details:", error)
            toast.error("An error occurred while loading order details")
        }
    }

    // Function to handle image selection for shipping
    const toggleImageSelection = (imageId: number) => {
        setSelectedImageIds((prev) => {
            if (prev.includes(imageId)) {
                return prev.filter((id) => id !== imageId)
            } else {
                return [...prev, imageId]
            }
        })
    }

    // Function to create a shipping order
    const createShippingOrder = async () => {
        if (selectedImageIds.length === 0) {
            toast.error("Please select at least one image to ship")
            return
        }

        if (!shippingAddress.trim()) {
            toast.error("Please enter a shipping address")
            return
        }

        try {
            setIsCreatingOrder(true)
            const response = await shippingService.createShippingOrder({
                imageIds: selectedImageIds,
                shippingAddress,
                customerNote: customerNote.trim() || undefined,
            })

            if (response.isSuccess) {
                toast.success("Shipping order created successfully")
                setIsCreateOrderOpen(false)
                setSelectedImageIds([])
                setShippingAddress("")
                setCustomerNote("")

                // Refresh the lists
                const imagesResponse = await shippingService.getShippableImages()
                if (imagesResponse.isSuccess) {
                    setShippableImages(imagesResponse.data)
                }

                // Switch to orders tab and refresh orders
                setActiveTab("orders")
                fetchShippingOrders()
            } else {
                toast.error(response.message || "Failed to create shipping order")
            }
        } catch (error) {
            console.error("Error creating shipping order:", error)
            toast.error("An error occurred while creating the shipping order")
        } finally {
            setIsCreatingOrder(false)
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

    return (
        <div className="space-y-6 min-h-[calc(100vh-16rem)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                    <TabsTrigger value="available" className="data-[state=active]:bg-white">
                        Available Images
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-white">
                        Shipping Orders
                    </TabsTrigger>
                </TabsList>

                {/* Available Images Tab */}
                <TabsContent value="available" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Available Images for Shipping</h2>
                        {shippableImages.length > 0 && (
                            <Button
                                onClick={() => setIsCreateOrderOpen(true)}
                                className="bg-purple-600 hover:bg-purple-700"
                                disabled={selectedImageIds.length === 0}
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Create Shipping Order
                                {selectedImageIds.length > 0 && ` (${selectedImageIds.length})`}
                            </Button>
                        )}
                    </div>

                    {isLoadingImages ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : shippableImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-lg bg-white/5 p-6">
                            <Package className="h-16 w-16 text-white/30 mb-4" />
                            <h3 className="text-xl font-medium text-white">No Images Available</h3>
                            <p className="text-white/60 text-center mt-2">
                                You don't have any purchased images available for shipping yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shippableImages.map((image) => (
                                <motion.div
                                    key={image.imageId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "relative border rounded-lg overflow-hidden transition-all duration-200",
                                        selectedImageIds.includes(image.imageId)
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-white/10 bg-white/5 hover:bg-white/10",
                                    )}
                                >
                                    <div className="absolute top-3 left-3 z-10">
                                        <Checkbox
                                            checked={selectedImageIds.includes(image.imageId)}
                                            onCheckedChange={() => toggleImageSelection(image.imageId)}
                                            className="h-5 w-5 border-white data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                        />
                                    </div>

                                    <div className="aspect-square">
                                        <img
                                            src={image.url || "/placeholder.svg"}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-medium text-white truncate">{image.title}</h3>
                                        <p className="text-white/60 text-sm mt-1 line-clamp-2">{image.description}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="font-semibold text-white">{image.price.toLocaleString("vi-VN")} ₫</span>
                                            <span className="text-xs text-white/60">
                                                Purchased: {format(new Date(image.purchaseDate), "MMM dd, yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Shipping Orders Tab */}
                <TabsContent value="orders" className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Shipping Orders</h2>

                    {isLoadingOrders ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : shippingOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-lg bg-white/5 p-6">
                            <Truck className="h-16 w-16 text-white/30 mb-4" />
                            <h3 className="text-xl font-medium text-white">No Shipping Orders</h3>
                            <p className="text-white/60 text-center mt-2">You haven't created any shipping orders yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {shippingOrders.map((order) => (
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
                                                <p className="text-sm text-white/60">Total Amount</p>
                                                <p className="font-semibold text-white">{order.totalAmount.toLocaleString("vi-VN")} ₫</p>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-white/10 text-black hover:bg-white"
                                                onClick={() => viewOrderDetails(order.orderId)}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                Details
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
                </TabsContent>
            </Tabs>

            {/* Create Shipping Order Dialog */}
            <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                <DialogContent className="bg-black border-white/10 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Create Shipping Order</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Fill in the details to create a shipping order for your selected images.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-4 max-h-[calc(80vh-12rem)]">
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="shippingAddress" className="text-white">Shipping Address</Label>
                                <Textarea
                                    id="shippingAddress"
                                    placeholder="Enter your full shipping address"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    className="min-h-[80px] bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customerNote" className="text-white">Note (Optional)</Label>
                                <Textarea
                                    id="customerNote"
                                    placeholder="Any special instructions for shipping"
                                    value={customerNote}
                                    onChange={(e) => setCustomerNote(e.target.value)}
                                    className="min-h-[60px] bg-white/5 border-white/10 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Selected Images ({selectedImageIds.length})</Label>
                                <div className="h-[200px] rounded-md border border-white/10 p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        {shippableImages
                                            .filter((image) => selectedImageIds.includes(image.imageId))
                                            .map((image) => (
                                                <div key={image.imageId} className="flex gap-4 items-start">
                                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={image.url || "/placeholder.svg"}
                                                            alt={image.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-white">{image.title}</h4>
                                                        <p className="text-sm text-white/60 line-clamp-2">{image.description}</p>
                                                        <p className="text-sm font-semibold text-white mt-1">
                                                            {image.price.toLocaleString("vi-VN")} ₫
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                                        onClick={() => toggleImageSelection(image.imageId)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/60">Original Price:</span>
                                    <span className="text-white">
                                        {shippableImages
                                            .filter((image) => selectedImageIds.includes(image.imageId))
                                            .reduce((sum, image) => sum + image.price, 0)
                                            .toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/60">Shipping Fee:</span>
                                    <span className="text-white">{(selectedImageIds.length * 400).toLocaleString("vi-VN")} ₫</span>
                                </div>
                                <div className="flex justify-between items-center font-semibold">
                                    <span className="text-white">Total:</span>
                                    <span className="text-white text-lg">
                                        {(
                                            shippableImages
                                                .filter((image) => selectedImageIds.includes(image.imageId))
                                                .reduce((sum, image) => sum + image.price, 0) +
                                            selectedImageIds.length * 400
                                        ).toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateOrderOpen(false)}
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={createShippingOrder}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isCreatingOrder || selectedImageIds.length === 0 || !shippingAddress.trim()}
                        >
                            {isCreatingOrder ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Package className="mr-2 h-4 w-4" />
                                    Create Order
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Order Details Dialog */}
            <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
                <DialogContent className="bg-black border-white/10 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-white/60">Shipping Address</h4>
                                        <p className="text-white bg-white/5 p-3 rounded-md border border-white/10">
                                            {selectedOrder.shippingAddress}
                                        </p>
                                    </div>
                                </div>

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

                                {selectedOrder.deliveryProofImageUrl && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-white/60">Delivery Proof</h4>
                                        <div className="bg-white/5 p-3 rounded-md border border-white/10">
                                            <img
                                                src={selectedOrder.deliveryProofImageUrl || "/placeholder.svg"}
                                                alt="Delivery Proof"
                                                className="w-full max-h-[300px] object-contain rounded"
                                            />
                                        </div>
                                    </div>
                                )}

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
