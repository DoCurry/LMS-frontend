import { useEffect, useState } from 'react';
import { BookOpen, Users, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  bookAPI, orderAPI, userAPI
} from '@/api/api';
import type { OrderDto } from '@/models/order.model';

interface DashboardStats {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get data
        const [booksResponse, ordersResponse, usersResponse] = await Promise.all([
          bookAPI.getAll(),
          orderAPI.getAll(),
          userAPI.getAll()
        ]);

        const books = booksResponse.data.data;
        const orders = ordersResponse.data.data;
        const users = usersResponse.data.data;

        setStats({
          totalBooks: books.length,
          totalOrders: orders.length,
          totalUsers: users.length
        });
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError(error?.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-2">Welcome to your library management dashboard.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
