import React from 'react';
import SignUp from './components/general/SignUp'
import SignIn from './components/general/SignIn';
import Footer from './components/Footer/Footer';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
//import logo from './logo.svg';
import './App.css';


import { SocialDistance } from '@mui/icons-material';
//import { useEffect } from "react";
//import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">

      {/* <Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Footer />
      </Route> */}
      <SignUp />
      {/* <Footer />
      <ToastContainer /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
