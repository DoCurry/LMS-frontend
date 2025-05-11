import { BrowserRouter, Route, Routes } from "react-router-dom"
import SigninPage from "../pages/signin/signin.pages"
import SignupPage from "../pages/signup/signup.pages"
import HomeLayout from "../pages/layout/home.layout"
import AdminLayout from "../pages/layout/admin.layout"
import ErrorPage from "../pages/error/error.pages"
import AdminDashboardPage from "../pages/admin-dashboard/admin-dashboard.pages"
import AdminLogin from "../pages/admin-dashboard/admin-login.pages"
import HomePage from "../pages/home/home.pages"
import BooksPage from "../pages/books/books.pages"
import { CartPage } from "@/components/Carts/CartPage"  
import ForgetPasswordPage from '@/components/ForgetPasswordPage';
import StaffPickupPage from '@/components/StaffPickupPage';


function RoutingConfig() {
    return (
        <>

            <BrowserRouter>


                <Routes>
                    <Route path="/signin" element={<SigninPage />}></Route>
                    <Route path="/signup" element={<SignupPage />}></Route>
                    <Route path="admin-login" element={<AdminLogin />}></Route>
                    <Route path="/forget-password" element={<ForgetPasswordPage />} />  
                    <Route path="/claim" element={<StaffPickupPage />} />

                    <Route path="/cart" element={<CartPage />}></Route>
                    <Route path="/" element={<HomeLayout />}>
                        <Route index element={<HomePage />}></Route>
                        <Route path="books" element={<BooksPage />}></Route>
                        <Route path="*" element={<ErrorPage title="Back to Homepage" link="/" />}></Route>
                    </Route>

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />}></Route>
                        {/* <Route path="books" element={< />}></Route> */}
                        <Route path="*" element={<ErrorPage title="Back to Dashboard" link="/admin" />}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>


        </>
    )
}

export default RoutingConfig
