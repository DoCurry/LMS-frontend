import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "../pages/signin/signin.pages";
import SignupPage from "../pages/signup/signup.pages";
import HomeLayout from "../pages/layout/home.layout";
import AdminLayout from "../pages/layout/admin.layout";
import ErrorPage from "../pages/error/error.pages";
import HomePage from "../pages/home/home.pages";
import BooksPage from "../pages/books/books.pages";
import BookDetailsPage from "../pages/books/book-details.pages";
import BookmarksPage from "../pages/bookmarks/bookmarks.pages";
import AdminBooksPage from "../pages/admin/books/admin-books.pages";
import AdminDashboardPage from "@/pages/admin-dashboard/admin-dashboard.pages";
import AuthorManagement from "@/pages/admin-author/admin-author.pages";
import PublisherManagement from "@/pages/admin-publisher/admin-publisher.pages";
import OrderManagement from "@/pages/admin-order/admin-order.pages";
import AnnouncementManagement from "@/pages/admin-announcement/admin-announcement.pages";


function RoutingConfig() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="books" element={<BooksPage />} />
                    <Route path="book-details" element={<BookDetailsPage />} />
                    <Route path="bookmarks" element={<BookmarksPage />} />
                    <Route path="*" element={<ErrorPage title="Back to Homepage" link="/" />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="books" element={<AdminBooksPage />} />
                    <Route path="admin-author" element={<AuthorManagement />} />
                    <Route path="admin-publisher" element={<PublisherManagement />} />
                    <Route path="admin-order" element={<OrderManagement />} />
                    <Route path="admin-announcement" element={<AnnouncementManagement />} />
                    <Route path="*" element={<ErrorPage title="Back to Dashboard" link="/admin" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutingConfig;
