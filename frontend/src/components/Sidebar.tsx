import {
  BsSpeedometer2,
  BsCashCoin,
  BsTable,
  BsGrid,
  BsPersonCircle,
  BsCartCheck,
  BsPeople,
  BsLock
} from "react-icons/bs";
import "./Sidebar.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface SidebarProp {
  active: string;
}

const Sidebar: React.FC<SidebarProp> = (props) => {

  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="sidebar bg-light d-flex flex-column p-2 vh-100">
      <span className="d-flex mb-3 align-items-center pe-3 mb-4 d-none d-sm-inline fs-4 text-uppercase text-nowrap">
        🛒 Cashierless Store
      </span>
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Pages</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <Link to="/Dashboard" className={(props.active === "Dashboard" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsSpeedometer2 className={(props.active === "Dashboard" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Dashboard" ? "blue" : "gray") + " d-none d-sm-inline"}>Dashboard</span>
          </li>
        </Link>
        <Link to="/Topup" className={(props.active === "Topup" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsCashCoin className={(props.active === "Topup" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Topup" ? "blue" : "gray") + " d-none d-sm-inline"}>Topup</span>
          </li>
        </Link>
        <Link to="/Transaction" className={(props.active === "Transaction" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsTable className={(props.active === "Transaction" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Transaction" ? "blue" : "gray") + " d-none d-sm-inline"}>Transaction</span>
          </li>
        </Link>
      </ul>
      {user?.is_shop_owner &&
        <>
          <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Shop Management</span>
          <ul className="nav nav-pills flex-column mt-2 mb-4">
            <Link to="" className={(props.active === "Stocking" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
              <li
                className={"nav-item p-2 py-0 ms-1"}
              >
                <BsGrid className={(props.active === "Stocking" ? "blue " : "gray ") + "me-2"} />
                <span className={(props.active === "Stocking" ? "blue" : "gray") + " d-none d-sm-inline"}>Stocking</span>
              </li>
            </Link>
            <Link to="" className={(props.active === "Shop Transaction" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
              <li
                className={"nav-item p-2 py-0 ms-1"}
              >
                <BsTable className={(props.active === "Stocking" ? "blue " : "gray ") + "me-2"} />
                <span className={(props.active === "Stocking" ? "blue" : "gray") + " d-none d-sm-inline"}>Shop Transaction</span>
              </li>
            </Link>
          </ul>
        </>

      }
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Account Settings</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <Link to="/PersonalInfo" className={(props.active === "Personal Info" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsPeople className={(props.active === "Personal Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Personal Info" ? "blue" : "gray") + " d-none d-sm-inline"}>Personal Info</span>
          </li>
        </Link>
        <Link to="/AccountInfo" className={(props.active === "Account Info" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsLock className={(props.active === "Account Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Account Info" ? "blue" : "gray") + " d-none d-sm-inline"}>Account Info</span>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;