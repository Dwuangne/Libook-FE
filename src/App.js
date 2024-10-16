// import React, { useEffect } from "react";
// import SignUp from "./components/general/SignUp";
// import SignIn from "./components/general/SignIn";
// import ProtectedRoute from "./gateway/RoleTransit";
// import Footer from "./components/Footer/Footer";
// import Header from "./components/Header/Header";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
// import HomePage from "./components/general/homePage";
// import Chatbox from "./components/general/Chatbox";
// import BookList from "./components/general/BookList";
// import AdminLayout from "./components/admin/AdminLayout";
// import AdminHome from "./components/admin/AdminHome";

// //import "./reset.css";
// import "./App.css";
// import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import ProductDetailsManagement from "./components/admin/BookDetailsManagement";
// import ProductManagement from "./components/admin/BookManagement";
// import VoucherManagement from "./components/admin/VoucherManagement";
// import MessagesManagement from "./components/admin/MessagesManagement";
// import ReportManagement from "./components/admin/ReportManagement";

// import { useNavigate } from "react-router-dom";

// function App() {
//   const location = useLocation();
//   const navigate = useNavigate(); // get navigate function
//   const role = localStorage.getItem("role"); // get the role from localStorage

//   console.log(role);
//   useEffect(() => {
//     if (role === "admin" && !location.pathname.startsWith("/admin")) {
//       navigate("/admin");
//     }
//   }, [role, location, navigate]);

//   return (
//     <div className="App" backgroundColor="grey">
//       <Header />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/bookslist" element={<BookList />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<SignIn />} />

//         <Route element={<ProtectedRoute allowedRole="Customer" />}></Route>

//         <Route element={<ProtectedRoute allowedRole="Admin" />}>
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<Navigate to={"/admin/dashboard"} />} />
//             <Route path="dashboard" element={<AdminHome />} />
//             <Route path="books" element={<ProductManagement />} />
//             <Route path="bookdetails" element={<ProductDetailsManagement />} />
//             <Route path="vouchers" element={<VoucherManagement />} />
//             <Route path="messages" element={<MessagesManagement />} />
//             <Route path="reports" element={<ReportManagement />} />
//           </Route>
//         </Route>
//       </Routes>

//       {/* Kiểm tra nếu không phải trang admin, hiển thị Chatbox */}
//       {!(
//         location.pathname.startsWith("/admin") ||
//         location.pathname.startsWith("/signin") ||
//         location.pathname.startsWith("/signup")
//       ) && <Chatbox />}

//       <Footer />
//       <ToastContainer />
//     </div>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SignUp from "./components/general/SignUp";
import SignIn from "./components/general/SignIn";
import ProtectedRoute from "./gateway/RoleTransit";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/general/homePage";
import Chatbox from "./components/general/Chatbox";
import BookList from "./components/general/BookList";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import ProductDetailsManagement from "./components/admin/BookDetailsManagement";
import ProductManagement from "./components/admin/BookManagement";
import VoucherManagement from "./components/admin/VoucherManagement";
import MessagesManagement from "./components/admin/MessagesManagement";
import ReportManagement from "./components/admin/ReportManagement";

import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // get navigate function
  const role = localStorage.getItem("role"); // get the role from localStorage

  // Check if the user is an admin and redirect to /admin if they try to access non-admin routes
  useEffect(() => {
    if (role === "admin" && !location.pathname.startsWith("/admin")) {
      navigate("/admin");
    }
  }, [role, location, navigate]);

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/bookslist" element={<BookList />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRole="Customer" />}></Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to={"/admin/dashboard"} />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="books" element={<ProductManagement />} />
            <Route path="bookdetails" element={<ProductDetailsManagement />} />
            <Route path="vouchers" element={<VoucherManagement />} />
            <Route path="messages" element={<MessagesManagement />} />
            <Route path="reports" element={<ReportManagement />} />
          </Route>
        </Route>
      </Routes>

      {/* Show Chatbox only on non-admin pages */}
      {!(
        location.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/signin") ||
        location.pathname.startsWith("/signup")
      ) && <Chatbox />}

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
