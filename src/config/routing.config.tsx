import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "../pages/signin/signin.pages";
import SignupPage from "../pages/signup/signup.pages";
import HomeLayout from "../pages/layout/home.layout";
import AdminLayout from "../pages/layout/admin.layout";
import ErrorPage from "../pages/error/error.pages";
import HomePage from "../pages/home/home.pages";
import BooksPage from "../pages/books/books.pages";
import BookDetailsPage from "../pages/books/book-details.pages";
import AdminBooksPage from "../pages/admin/books/admin-books.pages";

function RoutingConfig() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SigninPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>

          <Route path="/books" element={<HomeLayout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="books" element={<BooksPage />}></Route>
            <Route path="book-details" element={<BookDetailsPage />}></Route>
            <Route
              path="*"
              element={<ErrorPage title="Back to Homepage" link="/" />}
            ></Route>
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="books" element={<AdminBooksPage />} />
            <Route
              path="*"
              element={<ErrorPage title="Back to Dashboard" link="/admin" />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default RoutingConfig;
