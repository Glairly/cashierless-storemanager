import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SalesHistory from "./pages/admin/SalesHistory";
import Stocking from "./pages/admin/Stocking";
import Store from "./pages/store/Store";
import CheckOut from "./pages/store/CheckOut";
import Payment from "./pages/store/Payment";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AboutUs" element={<AboutUs />}></Route>
      <Route path="/Product" element={<Product />} />
      <Route path="/ContactUs" element={<ContactUs />}></Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/Register" element={<Register />}></Route>
      <Route path="/Dashboard" element={<Dashboard />}></Route>
      <Route path="/Transaction" element={<Transaction />}></Route>
      <Route path="/Profile" element={<Profile />}></Route>
      <Route path="/Admin/Register" element={<AdminRegister />}></Route>
      <Route path="/Admin/Dashboard" element={<AdminDashboard />}></Route>
      <Route path="/Admin/SalesHistory" element={<SalesHistory />}></Route>
      <Route path="/Admin/Stocking" element={<Stocking />}></Route>
      <Route path="/Store" element={<Store />}></Route>
      <Route path="/Store/CheckOut" element={<CheckOut />}></Route>
      <Route path="/Store/Payment" element={<Payment />}></Route>
    </Routes>
  );
};

export default App;
