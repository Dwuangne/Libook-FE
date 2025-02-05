import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import SignUp from "./components/general/SignUp";
import SignIn from "./components/general/SignIn";
import ProtectedRoute from "./gateway/ProtectedRoute";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HomePage from "./components/general/homePage";
import Chatbox from "./components/general/Chatbox";
import BookList from "./components/general/BookList";
import BookDetails from "./components/general/BookDetails";
import Cart from "./components/general/Cart";

//customer
import Checkout from "./components/general/MakeOrder/Checkout";
import Payment from "./components/general/Payment";

//admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import ProductDetailsManagement from "./components/admin/BookDetailsManagement";
import ProductManagement from "./components/admin/BookManagement";
import VoucherManagement from "./components/admin/VoucherManagement";
import MessagesManagement from "./components/admin/MessagesManagement";
import ReportManagement from "./components/admin/ReportManagement";

import { jwtDecode } from "jwt-decode";

function App() {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
  const role = decodedAccessToken
    ? decodedAccessToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ]
    : null;

  const redirectIfAdmin = (element) => {
    return role === "Admin" ? <Navigate to="/admin" /> : element;
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={redirectIfAdmin(<HomePage />)} />
        <Route path="/bookslist" element={redirectIfAdmin(<BookList />)} />
        <Route path="/signup" element={redirectIfAdmin(<SignUp />)} />
        <Route path="/signin" element={redirectIfAdmin(<SignIn />)} />
        <Route path="/:bookId" element={redirectIfAdmin(<BookDetails />)} />
        <Route path="/cart" element={redirectIfAdmin(<Cart />)} />

        {/* Customer Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="Customer" />}>
          {/* Customer routes here */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="books" element={<ProductManagement />} />
            <Route
              path="bookdetails/:bookId"
              element={<ProductDetailsManagement />}
            />
            <Route path="vouchers" element={<VoucherManagement />} />
            <Route path="messages" element={<MessagesManagement />} />
            <Route path="reports" element={<ReportManagement />} />
          </Route>
        </Route>
      </Routes>

      {/* Show Chatbox only on non-admin pages */}
      <Chatbox />

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
