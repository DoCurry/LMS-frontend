import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderAPI } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderDto } from "@/models/order.model";
import { OrderStatus } from "@/models/enums";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(orderId!);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setProcessingAction(true);
      await orderAPI.cancel(order.id);
      await loadOrder();
      toast.success('Order cancelled successfully');
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleProceedToPickup = async () => {
    if (!order) return;

    try {
      setProcessingAction(true);
      await orderAPI.setReadyForPickup(order.id);
      await loadOrder();
      toast.success('Order marked as ready for pickup');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadgeClasses = (status: OrderStatus, isCancelled: boolean) => {
    if (isCancelled) return "bg-red-100 text-red-800";
    
    switch (status) {
      case OrderStatus.ReadyForPickup:
        return "bg-green-100 text-green-800";
      case OrderStatus.Completed:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };
  const formatDisplayStatus = (status: OrderStatus, isCancelled: boolean) => {
    if (isCancelled) return "Cancelled";
    
    switch (status) {
      case OrderStatus.ReadyForPickup:
        return "Ready for Pickup";
      case OrderStatus.Pending:
        return "Pending";
      case OrderStatus.Completed:
        return "Completed";
      default:
        return status;
    }
  };

  const renderActionButtons = () => {
    if (!order) return null;

    if (order.isCancelled) return null;

    if (order.status === OrderStatus.Pending) {
      return (
        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={handleProceedToPickup}
            disabled={processingAction}
          >
            {processingAction ? "Processing..." : "Proceed to Pickup"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCancelDialogOpen(true)}
            disabled={processingAction}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Cancel Order
          </Button>
        </div>
      );
    }

    if (order.status === OrderStatus.ReadyForPickup) {
      return (
        <Button
          variant="outline"
          onClick={() => setCancelDialogOpen(true)}
          disabled={processingAction}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Cancel Order
        </Button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')} className="bg-blue-600 hover:bg-blue-700">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="mt-2 text-gray-600">Order #{order.id.substring(0, 8)}</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </div>

        {/* Order Status Card */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
              <div className="mt-2">
                <Badge
                  variant={order.isCancelled ? "destructive" : "default"}
                  className={getStatusBadgeClasses(order.status, order.isCancelled)}
                >
                  {formatDisplayStatus(order.status, order.isCancelled)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">{format(new Date(order.orderDate), 'PPP')}</p>
              {order.lastUpdated && (
                <>
                  <p className="text-sm text-gray-600 mt-2">Last Updated</p>
                  <p className="font-medium">{format(new Date(order.lastUpdated), 'PPP')}</p>
                </>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Action Buttons */}
          {renderActionButtons()}
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={item.book.imageUrl || '/placeholder-book.svg'}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.book.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      Price: ${item.priceAtTime.toFixed(2)}                      {item.discountAtTime && item.discountAtTime > 0 && (
                        <span className="text-green-600 ml-2">
                          (Saved ${item.discountAtTime.toFixed(2)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  ${(item.priceAtTime * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.subTotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span className="text-blue-600">${order.finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Cancel Order Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={processingAction}>
                Keep Order
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelOrder}
                disabled={processingAction}
                className="bg-red-600 hover:bg-red-700"
              >
                {processingAction ? "Cancelling..." : "Cancel Order"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
