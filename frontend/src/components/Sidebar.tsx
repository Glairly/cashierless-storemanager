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
  const isThai = useSelector((state: RootState) => state.translation.isThai)

  return (
    <div className="sidebar bg-light d-flex flex-column p-2 vh-100">
      <span className="d-flex mb-3 align-items-center pe-3 mb-4 d-none d-sm-inline fs-4 text-uppercase text-nowrap">
        🛒 Cashierless
      </span>
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">{isThai ? "Pages" : "หน้าใช้งาน"}</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <Link to="/Dashboard" className={(props.active === "Dashboard" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsSpeedometer2 className={(props.active === "Dashboard" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Dashboard" ? "blue" : "gray") + " d-none d-sm-inline"}>
              {isThai ? "Dashboard" : "หน้าใช้งานหลัก"}
            </span>
          </li>
        </Link>
        <Link to="/Topup" className={(props.active === "Topup" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsCashCoin className={(props.active === "Topup" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Topup" ? "blue" : "gray") + " d-none d-sm-inline"}>
              {isThai ? "Topup" : "เติมเงิน"}
            </span>
          </li>
        </Link>
        <Link to="/Transaction" className={(props.active === "Transaction" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsTable className={(props.active === "Transaction" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Transaction" ? "blue" : "gray") + " d-none d-sm-inline"}>
              {isThai ? "Transaction" : "ประวัติการชำระเงิน"}
            </span>
          </li>
        </Link>
      </ul>
      {user?.is_shop_owner &&
        <>
          <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">{isThai ? "Shop Management" : "จัดการร้านค้าของคุณ"}</span>
          <ul className="nav nav-pills flex-column mt-2 mb-4">
            <Link to="/Stocking" className={(props.active === "Stocking" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
              <li
                className={"nav-item p-2 py-0 ms-1"}
              >
                <BsGrid className={(props.active === "Stocking" ? "blue " : "gray ") + "me-2"} />
                <span className={(props.active === "Stocking" ? "blue" : "gray") + " d-none d-sm-inline"}>
                  {isThai ? "Stocking" : "สต็อกสินค้า"}
                </span>
              </li>
            </Link>
            <Link to="/ShopTransaction" className={(props.active === "Shop Transaction" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
              <li
                className={"nav-item p-2 py-0 ms-1"}
              >
                <BsTable className={(props.active === "Shop Transaction" ? "blue " : "gray ") + "me-2"} />
                <span className={(props.active === "Shop Transaction" ? "blue" : "gray") + " d-none d-sm-inline"}>
                  {isThai ? "Shop Transaction" : "ประวัติการขาย"}
                </span>
              </li>
            </Link>
          </ul>
        </>

      }
      <span className="fs-5 fw-bold ps-2 d-none d-sm-inline">{isThai ? "Account Settings" : "ตั้งค่าบัญชี"}</span>
      <ul className="nav nav-pills flex-column mt-2 mb-4">
        <Link to="/PersonalInfo" className={(props.active === "Personal Info" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsPeople className={(props.active === "Personal Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Personal Info" ? "blue" : "gray") + " d-none d-sm-inline"}>
              {isThai ? "Personal Info" : "ตั้งค่าข้อมูลส่วนตัว"}
            </span>
          </li>
        </Link>
        <Link to="/AccountInfo" className={(props.active === "Account Info" && "active-side ") + "p-1 text-decoration-none py-3 my-1"}>
          <li
            className={"nav-item p-2 py-0 ms-1"}
          >
            <BsLock className={(props.active === "Account Info" ? "blue " : "gray ") + "me-2"} />
            <span className={(props.active === "Account Info" ? "blue" : "gray") + " d-none d-sm-inline"}>
              {isThai ? "Account Info" : "ตั้งค่ารหัสผ่าน"}
            </span>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;