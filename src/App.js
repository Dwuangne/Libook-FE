import React from "react";
import SignUp from "./components/general/SignUp";
import SignIn from "./components/general/SignIn";
import ProtectedRoute from "./gateway/RoleTransit";
import Footer from "./components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/general/homePage";
import BookList from "./components/general/BookList";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";

//import "./reset.css";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import ProductDetailsManagement from "./components/admin/BookDetailsManagement";
import ProductManagement from "./components/admin/BookManagement";
import VoucherManagement from "./components/admin/VoucherManagement";
import MessageManagement from "./components/admin/MessageManagement";
import ReportManagement from "./components/admin/ReportManagement";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookslist" element={<BookList />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route element={<ProtectedRoute allowedRole="Customer" />}></Route>

        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to={"/admin/dashboard"} />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="books" element={<ProductManagement />} />
            <Route path="bookdetails" element={<ProductDetailsManagement />} />
            <Route path="vouchers" element={<VoucherManagement />} />
            <Route path="messages" element={<MessageManagement />} />
            <Route path="reports" element={<ReportManagement />} />
          </Route>
        </Route>
      </Routes>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
