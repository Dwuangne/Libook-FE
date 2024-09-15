import React from "react";
import SignUp from "./components/general/SignUp";
import SignIn from "./components/general/SignIn";
//import Footer from "./components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

//import "./reset.css";
import "./App.css";

//import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp />} />

        <Route path="/signin" element={<SignIn />} />
      </Routes>

      {/* <Footer />
      <ToastContainer /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
