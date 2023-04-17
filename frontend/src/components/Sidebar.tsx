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
      <span className="d-flex mb-3 align-items-center pe-3 mb-4 d-none d-sm-inline fs-4 text-uppercase text-nowrap">
        🛒 Cashierless Store
      </span>
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Pages</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <Link to="/new" className={(active === "Dashboard" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
            onClick={() => setActive("Dashboard")}
          >
            <BsSpeedometer2 className={(active === "Dashboard" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Dashboard" ? "blue" : "gray") + " d-none d-sm-inline"}>Dashboard</span>
          </li>
        </Link>
        <Link to="" className={(active === "Topup" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
            onClick={() => setActive("Topup")}
          >
            <BsCashCoin className={(active === "Topup" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Topup" ? "blue" : "gray") + " d-none d-sm-inline"}>Topup</span>
          </li>
        </Link>
        <Link to="/new1" className={(active === "Transaction" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
            onClick={() => setActive("Transaction")}
          >
            <BsTable className={(active === "Transaction" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Transaction" ? "blue" : "gray") + " d-none d-sm-inline"}>Transaction</span>
          </li>
        </Link>
        <Link to="" className={(active === "Report" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
            onClick={() => setActive("Report")}
          >
            <BsGrid className={(active === "Report" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Report" ? "blue" : "gray") + " d-none d-sm-inline"}>Report</span>
          </li>
        </Link>
      </ul>
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">Account Settings</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <Link to="" className={(active === "Personal Info" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
            onClick={() => setActive("Personal Info")}
          >
            <BsPeople className={(active === "Personal Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Personal Info" ? "blue" : "gray") + " d-none d-sm-inline"}>Personal Info</span>
          </li>
        </Link>
        <Link to="" className={(active === "Account Info" && "active ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
            onClick={() => setActive("Account Info")}
          >
            <BsLock className={(active === "Account Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(active === "Account Info" ? "blue" : "gray") + " d-none d-sm-inline"}>Account Info</span>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;