import { useState, useEffect } from 'react';
import { orderAPI } from '@/api/api';
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "@/models/enums";
import { BookDto } from "@/models/book.model";
import { UserDto } from "@/models/user.model";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  bookId: string;
  book: BookDto;
  quantity: number;
  priceAtTime: number;
  discountAtTime?: number;
  createdAt: string;
  lastUpdated?: string;
}

interface Order {
  id: string;
  claimCode: string;
  userId: string;
  user: UserDto;
  orderDate: string;
  status: OrderStatus;
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
  isCancelled: boolean;
  cancellationDate?: string;
  orderItems: OrderItem[];
  createdAt: string;
  lastUpdated?: string;
}

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: OrderStatus, isCancelled: boolean) => {
    if (isCancelled) return "bg-red-100 text-red-800";
    
    switch (status) {
      case OrderStatus.Completed:
        return "bg-green-100 text-green-800";
      case OrderStatus.ReadyForPickup:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.Pending:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDisplayStatus = (status: OrderStatus, isCancelled: boolean) => {
    if (isCancelled) return "Cancelled";
    
    switch (status) {
      case OrderStatus.ReadyForPickup:
        return "Ready for Pickup";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Browse our books and place your first order!</p>
          <button
            onClick={() => navigate('/books')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeStyle(order.status, order.isCancelled)}`}>
                        {formatDisplayStatus(order.status, order.isCancelled)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {order.discountAmount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        ${order.subTotal.toFixed(2)}
                      </p>
                    )}
                    <p className="font-semibold text-gray-900">
                      Total: ${order.finalTotal.toFixed(2)}
                    </p>
                    {order.status === OrderStatus.ReadyForPickup && (
                      <p className="text-sm text-gray-600 mt-1">
                        Claim Code: <span className="font-mono">{order.claimCode}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="space-y-2">
                    {order.orderItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{item.quantity}×</span>
                          <span className="text-gray-900">{item.book.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.discountAtTime && item.discountAtTime > 0 && (
                            <span className="text-gray-500 line-through">
                              ${(item.priceAtTime + item.discountAtTime).toFixed(2)}
                            </span>
                          )}
                          <span className="text-gray-900">
                            ${item.priceAtTime.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}    </div>  );
}
