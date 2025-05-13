import { useState } from 'react';
import { Edit, Trash2, X, Book, Calendar, User, Check, Clock, Truck, Ban, ChevronDown } from 'lucide-react';

interface OrderDto {
    id: string;
    bookTitle: string;
    bookId: string;
    customerName: string;
    customerEmail: string;
    quantity: number;
    totalPrice: number;
    orderDate: Date;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    lastUpdated?: Date;
}

interface UpdateOrderDto {
    status?: OrderDto['status'];
}

const OrderManagement = () => {
    // Sample data
    const [orders, setOrders] = useState<OrderDto[]>([
        {
            id: '1',
            bookTitle: 'The Great Gatsby',
            bookId: '101',
            customerName: 'John Doe',
            customerEmail: 'john.doe@example.com',
            quantity: 1,
            totalPrice: 12.99,
            orderDate: new Date('2023-05-15'),
            status: 'Delivered',
            lastUpdated: new Date('2023-05-18')
        },
        {
            id: '2',
            bookTitle: 'To Kill a Mockingbird',
            bookId: '102',
            customerName: 'Jane Smith',
            customerEmail: 'jane.smith@example.com',
            quantity: 2,
            totalPrice: 18.50,
            orderDate: new Date('2023-06-20'),
            status: 'Shipped',
            lastUpdated: new Date('2023-06-22')
        },
        {
            id: '3',
            bookTitle: '1984',
            bookId: '103',
            customerName: 'Bob Johnson',
            customerEmail: 'bob.johnson@example.com',
            quantity: 1,
            totalPrice: 9.99,
            orderDate: new Date('2023-07-10'),
            status: 'Processing'
        },
        {
            id: '4',
            bookTitle: 'Pride and Prejudice',
            bookId: '104',
            customerName: 'Alice Williams',
            customerEmail: 'alice.w@example.com',
            quantity: 3,
            totalPrice: 27.00,
            orderDate: new Date('2023-07-12'),
            status: 'Pending'
        },
        {
            id: '5',
            bookTitle: 'The Hobbit',
            bookId: '105',
            customerName: 'Charlie Brown',
            customerEmail: 'charlie.b@example.com',
            quantity: 1,
            totalPrice: 14.99,
            orderDate: new Date('2023-07-15'),
            status: 'Cancelled',
            lastUpdated: new Date('2023-07-16')
        }
    ]);

    // Form states
    const [updateFormData, setUpdateFormData] = useState<UpdateOrderDto>({
        status: undefined
    });

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Handle update form input changes
    const handleUpdateInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({ ...prev, [name]: value as OrderDto['status'] }));
    };

    // Handle update form submission
    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            setOrders(prev => prev.map(order => {
                if (order.id === isEditing) {
                    return {
                        ...order,
                        status: updateFormData.status || order.status,
                        lastUpdated: new Date()
                    };
                }
                return order;
            }));

            setUpdateFormData({ status: undefined });
            setIsEditing(null);
        }
    };

    // Delete an order
    const handleDelete = (id: string) => {
        setOrders(prev => prev.filter(order => order.id !== id));
    };

    // Start editing an order
    const startEditing = (order: OrderDto) => {
        setUpdateFormData({
            status: order.status
        });
        setIsEditing(order.id);
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status icon and color
    const getStatusDetails = (status: OrderDto['status']) => {
        switch (status) {
            case 'Pending':
                return { icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' };
            case 'Processing':
                return { icon: <Edit className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' };
            case 'Shipped':
                return { icon: <Truck className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' };
            case 'Delivered':
                return { icon: <Check className="h-4 w-4" />, color: 'bg-green-100 text-green-800' };
            case 'Cancelled':
                return { icon: <Ban className="h-4 w-4" />, color: 'bg-red-100 text-red-800' };
            default:
                return { icon: null, color: '' };
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Order Management</h1>



            {/* Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="px-4 py-2 border rounded-lg w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Update Order Form (Modal) */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Update Order Status</h2>
                            <button
                                onClick={() => setIsEditing(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={updateFormData.status || ''}
                                    onChange={handleUpdateInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select status...</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>


                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Book className="h-4 w-4 inline mr-1" />
                                    Book
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <User className="h-4 w-4 inline mr-1" />
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Qty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    Order Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.bookTitle}</div>
                                        <div className="text-sm text-gray-500">ID: {order.bookId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.customerName}</div>
                                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {order.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {formatDate(order.orderDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusDetails(order.status).color}`}>
                                            {getStatusDetails(order.status).icon}
                                            <span className="ml-1">{order.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {order.lastUpdated ? formatDate(order.lastUpdated) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEditing(order)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;