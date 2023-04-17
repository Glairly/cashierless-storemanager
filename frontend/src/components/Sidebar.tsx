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

interface SidebarProp {
  active: string;
}

const Sidebar: React.FC<SidebarProp> = (props) => {
  const [active, setActive] = useState<string>(props.active);
  return (
    <div className="sidebar bg-light d-flex flex-column p-2 vh-100">
      <span className="d-flex mb-3 align-items-center pe-5 mb-4 d-none d-sm-inline fs-4 text-uppercase text-nowrap">
        🛒 Cashierless Store
      </span>
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Pages</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <li
          className={active === "Dashboard" ? "active nav-item p-2 py-0 my-1" : "nav-item p-2 py-0"}
          onClick={() => setActive("Dashboard")}
        >
          <Link to="/new" className="p-1 text-decoration-none py-0">
            <BsSpeedometer2 className={(active === "Dashboard" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Dashboard" ? "blue" : "gray") + " d-none d-sm-inline"}>Dashboard</span>
          </Link>
        </li>
        <li
          className={active === "Topup" ? "active nav-item p-2 py-0 my-1" : "nav-item p-2 py-0"}
          onClick={() => setActive("Topup")}
        >
          <Link to="" className="p-1 text-decoration-none py-0">
            <BsCashCoin className={(active === "Topup" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Topup" ? "blue" : "gray") + " d-none d-sm-inline"}>Topup</span>
          </Link>
        </li>
        <li
          className={active === "Order" ? "active nav-item p-2 py-0 my-1" : "nav-item p-2 py-0"}
          onClick={() => setActive("Order")}
        >
          <Link to="" className="p-1 text-decoration-none py-0">
            <BsTable className={(active === "Order" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Order" ? "blue" : "gray") + " d-none d-sm-inline"}>Order</span>
          </Link>
        </li>
        <li
          className={active === "Report" ? "active nav-item p-2 py-0 my-1" : "nav-item p-2 py-0"}
          onClick={() => setActive("Report")}
        >
          <Link to="" className="p-1 text-decoration-none py-0">
            <BsGrid className={(active === "Report" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Report" ? "blue" : "gray") + " d-none d-sm-inline"}>Report</span>
          </Link>
        </li>
      </ul>
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Account Settings</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <li
          className={active === "Personal Info" ? "active nav-item p-2 py-0 my-1" : "nav-item p-2 py-0"}
          onClick={() => setActive("Personal Info")}
        >
          <Link to="/new" className="p-1 text-decoration-none py-0">
            <BsPeople className={(active === "Personal Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Personal Info" ? "blue" : "gray") + " d-none d-sm-inline"}>Personal Info</span>
          </Link>
        </li>
        <li
          className={active === "Account Info" ? "active nav-item p-2 py-0 my-1" : "nav-item p-2 py-0"}
          onClick={() => setActive("Account Info")}
        >
          <Link to="/new" className="p-1 text-decoration-none py-0">
            <BsLock className={(active === "Account Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Account Info" ? "blue" : "gray") + " d-none d-sm-inline"}>Account Info</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;