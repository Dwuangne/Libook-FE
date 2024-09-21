import React from "react";
import SignUp from "./components/general/SignUp";
import SignIn from "./components/general/SignIn";
import ProtectedRoute from "./gateway/RoleTransit";
//import Footer from "./components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

//import "./reset.css";
import "./App.css";
// "commit ho t cai "
//import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />


        <Route element={<ProtectedRoute allowedRole="customer" />}>

        </Route>

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          {/* <Route path="/admin" element={<SignUp />}>
            <Route index element={<Navigate to={"/admin/dashboard"} />} />
          </Route>  */}

        </Route>
      </Routes>

     
      <ToastContainer />
    </div>
  );
}

export default App;
