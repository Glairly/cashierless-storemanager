import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
import { RootState } from "./app/store";
import { useSelector } from "react-redux";
import "./App.css";
import Setup from "./pages/store/Setup";
import FaceCam from "./pages/store/FaceCam";
import Layout from "./pages/Layout";
import NewDashboard from "./pages/NewDashboard";

const App: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth.auth);
  const user = useSelector((state: RootState) => state.auth.user);
  const inference = useSelector((state: RootState) => state.inference);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AboutUs" element={<AboutUs />}></Route>
      <Route path="/Product" element={<Product />} />
      <Route path="/New" element={<Layout navTitle="Dashboard" children={<NewDashboard />} />}></Route>
      <Route path="/ContactUs" element={<ContactUs />}></Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/Register" element={<Register />}></Route>
      {user?.is_shop_owner ? (
        <Route path="/Dashboard" element={<AdminDashboard />}></Route>
      ) : (
        <Route path="/Dashboard" element={<Dashboard />}></Route>
      )}
      <Route path="/Transaction" element={<Transaction />}></Route>
      <Route path="/Profile" element={<Profile />}></Route>
      <Route path="/Admin/Register" element={<AdminRegister />}></Route>
      {/* <Route path="/Admin/Dashboard" element={<AdminDashboard />}></Route> */}
      <Route path="/Admin/SalesHistory" element={<SalesHistory />}></Route>
      <Route path="/Admin/Stocking" element={<Stocking />}></Route>

      <Route path="/Store/Setup" element={<Setup />}></Route>
      {inference.shop_id && inference.machine_id && (
        <>
          <Route path="/Store" element={<Store />}></Route>
          <Route path="/store/login" element={<FaceCam />}></Route>
          <Route path="/Store/CheckOut" element={<CheckOut />}></Route>
          <Route path="/Store/Payment" element={<Payment />}></Route>
        </>
      )}
      <Route path="/Store/*" element={<Navigate to="/Store/Setup" replace />} />

      <Route path="*" element={<div>Page not found</div>}></Route>
    </Routes>
  );
};

export default App;
