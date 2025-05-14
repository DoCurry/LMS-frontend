import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { orderAPI } from '@/api/api';
import { OrderStatus, getStatusName } from '@/models/enums';
import { Search, CircleDollarSign, Calendar, PackageCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';

interface OrderClaimDto {
  claimCode: string;
}

interface CompleteOrderDto {
  orderId: string;
  membershipId: string;
}

interface OrderDetailsDto {
  id: string;
  claimCode: string;
  orderDate: Date;
  status: OrderStatus;
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
  isCancelled: boolean;
  items: {
    id: string;
    book: {
      title: string;
      isbn: string;
      imageUrl?: string;
    };
    quantity: number;
    priceAtTime: number;
    discountAtTime?: number;
  }[];
  user: {
    name: string;
    email: string;
  };
}

export default function CompleteOrderPage() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetailsDto | null>(null);

  const claimForm = useForm<OrderClaimDto>();
  const completeForm = useForm<CompleteOrderDto>();

  const onSubmitClaim = async (data: OrderClaimDto) => {
    try {
      setLoading(true);
      const response = await orderAPI.getByClaimCode(data.claimCode);
      setOrder(response.data.data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to find order. Please check the claim code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitComplete = async (data: CompleteOrderDto) => {
    try {
      setLoading(true);      await orderAPI.complete(order!.id, data.membershipId);
      toast.success('Order completed successfully');
      // Reset forms and state
      setOrder(null);
      claimForm.reset();
      completeForm.reset();
    } catch (error: any) {
      console.error('Error completing order:', error);
      toast.error(error?.response?.data?.message || 'Failed to complete order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Complete Order</h2>
        <p className="text-gray-500 mt-2">Enter the claim code to process orders for pickup.</p>
      </div>

      {/* Claim Code Form */}
      <Card>
        <CardHeader>
          <CardTitle>Find Order</CardTitle>
          <CardDescription>Enter the claim code provided by the customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={claimForm.handleSubmit(onSubmitClaim)} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Enter claim code..."
                className="pl-9"
                {...claimForm.register('claimCode', { required: true })}
              />
            </div>
            <Button type="submit" disabled={loading}>Find Order</Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Details */}
      {order && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Claim Code: {order.claimCode}</CardDescription>
              </div>
              <Badge 
                variant={order.status === OrderStatus.ReadyForPickup ? "default" : "secondary"}
              >
                {getStatusName(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{format(new Date(order.orderDate), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-gray-500" />
                <span>Total: ${order.finalTotal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Customer:</span>
                <div>{order.user.name}</div>
                <div className="text-sm text-gray-500">{order.user.email}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {item.book.imageUrl && (
                    <img 
                      src={item.book.imageUrl} 
                      alt={item.book.title}
                      className="h-16 w-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.book.title}</div>
                    <div className="text-sm text-gray-500">ISBN: {item.book.isbn}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${(item.quantity * (item.priceAtTime - (item.discountAtTime || 0))).toFixed(2)}
                    </div>
                    {item.discountAtTime && (
                      <div className="text-sm text-gray-500 line-through">
                        ${(item.quantity * item.priceAtTime).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Order Form */}
            {order.status === OrderStatus.ReadyForPickup && (
              <form onSubmit={completeForm.handleSubmit(onSubmitComplete)} className="pt-6 border-t">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-lg mb-4">Complete Order</CardTitle>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter customer's membership ID..."
                          {...completeForm.register('membershipId', { required: true })}
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Complete Order
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
