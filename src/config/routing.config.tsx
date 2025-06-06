import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "../pages/auth/signin.pages";
import SignupPage from "../pages/auth/signup.pages";
import HomeLayout from "../pages/layout/home.layout";
import AdminLayout from "../pages/layout/admin.layout";
import ErrorPage from "../pages/error/error.pages";
import HomePage from "../pages/home/home.pages";
import BooksPage from "../pages/books/books.pages";
import BookDetailsPage from "../pages/books/book-details.pages";
import BookmarksPage from "../pages/bookmarks/bookmarks.pages";
import CartPage from "../pages/cart/cart.pages";
import AdminBooksPage from "../pages/admin/books/admin-books.pages";
import AdminDashboardPage from "@/pages/admin/dashboard/admin-dashboard.pages";
import AuthorManagement from "@/pages/admin/author/admin-author.pages";
import PublisherManagement from "@/pages/admin/publisher/admin-publisher.pages";
import OrderManagement from "@/pages/admin/order/admin-order.pages";
import AnnouncementManagement from "@/pages/admin/announcement/admin-announcement.pages";
import ForgetPasswordPage from '@/pages/auth/forgot-password.page';
import CompleteOrderPage from '@/pages/admin/complete-order/complete-order.pages';
import { StaffRoute } from "@/components/auth/StaffRoute";
import UserManagement from "@/pages/admin/user/admin-user.pages";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute";
import UserProfilePage from "@/pages/user/profile.pages";
import UserOrdersPage from "@/pages/orders/orders.pages";
import OrderDetailsPage from "@/pages/orders/order-details.pages";


function RoutingConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - Only accessible when not logged in */}
        <Route path="/login" element={<PublicOnlyRoute element={<SigninPage />} />} />
        <Route path="/sign-up" element={<PublicOnlyRoute element={<SignupPage />} />} />
        <Route path="/forget-password" element={<PublicOnlyRoute element={<ForgetPasswordPage />} />} />
          {/* Public Routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="books/:slug" element={<BookDetailsPage />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/" element={<PrivateRoute element={<HomeLayout />} />}>
        <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="orders" element={<UserOrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        </Route>        {/* Admin/Staff Routes */}
        <Route path="/admin" element={<StaffRoute element={<AdminLayout />} />}>
          {/* Admin-only routes */}
          <Route index element={<PrivateRoute element={<AdminDashboardPage />} adminOnly />} />
          <Route path="books" element={<PrivateRoute element={<AdminBooksPage />} adminOnly />} />
          <Route path="author" element={<PrivateRoute element={<AuthorManagement />} adminOnly />} />
          <Route path="publisher" element={<PrivateRoute element={<PublisherManagement />} adminOnly />} />
          <Route path="announcement" element={<PrivateRoute element={<AnnouncementManagement />} adminOnly />} />
          <Route path="user" element={<PrivateRoute element={<UserManagement />} adminOnly />} />
          
          {/* Staff-accessible route */}
          <Route path="complete-order" element={<CompleteOrderPage />} />
          
          <Route path="*" element={<ErrorPage title="Back to Dashboard" link="/admin" />} />
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<ErrorPage title="Back to Homepage" link="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutingConfig;
