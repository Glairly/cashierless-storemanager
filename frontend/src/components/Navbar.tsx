import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown, Image, Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { logout } from "../features/auth/authAPI";
import { BsCurrencyExchange, BsWalletFill } from "react-icons/bs";
import { setIsThai } from "../features/translation/translationSlice";
import { useAppDispatch } from "../app/hooks";

interface item {
  NavText: string;
  NavLink: string;
}

export const HomeNavbar: React.FC = () => {

  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const isThai = useSelector((state: RootState) => state.translation.isThai);

  return (
    <Navbar bg="white" expand="lg">
      <Container>
        <Navbar.Brand className="brand">
          <Link to={"/"}>🛒 Cashierless Store</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="toggle-home-navbar" />
        <Navbar.Collapse id="toggle-home-navbar">
          <Nav className="ms-auto nav-item">
            <ul className="item">
              <Link to={"/Home"}>
                <Button
                  variant="link"
                  className="text-decoration-none p-0 text-black"
                >
                  {isThai ? "Home" : "หน้าหลัก"}
                </Button>
              </Link>
            </ul>
            <ul className="item">
              <Link to={"/AboutUs"}>
                <Button
                  variant="link"
                  className="text-decoration-none p-0 text-black"
                >
                  {isThai ? "About Us" : "เกี่ยวกับเรา"}
                </Button>
              </Link>
            </ul>
            <ul className="item">
              <Link to={"/Product"}>
                <Button
                  variant="link"
                  className="text-decoration-none p-0 text-black"
                >
                  {isThai ? "Product" : "สินค้าและบริการ"}
                </Button>
              </Link>
            </ul>
            <ul className="mb-0">
              <a onClick={() => { dispatch<any>(setIsThai()) }} style={{ cursor: "pointer" }}>
                <Image
                  src={isThai ?
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png" :
                    "https://cdn.britannica.com/38/4038-004-111388C2/Flag-Thailand.jpg"}
                  roundedCircle
                  style={{ width: "25px", height: "25px" }}
                  className="align-self-center me-2"
                />
                {isThai ? "EN" : "TH"}
              </a>
            </ul>
            <ul className="mb-0">
              {user?.id ? (
                <Link to={"/Dashboard"} className=" ">
                  <Button variant="primary" className="text-white">
                    {isThai ? "Your Page" : "หน้าหลักของคุณ"}
                  </Button>
                </Link>
              ) : (
                <Link to={"/Login"}>
                  <Button variant="primary" className="text-white">
                    {isThai ? "Login" : "เข้าใช้งาน"}
                  </Button>
                </Link>
              )}
            </ul>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const DashboardNavbarItem: item[] = [
  { NavText: "Dashboard", NavLink: "/Dashboard" },
  { NavText: "History", NavLink: "/Transaction" },
];

export const DashbaordNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch<any>(logout());
    navigate("/");
  };

  return (
    <Navbar bg="white" expand="lg">
      <Container>
        <Navbar.Brand className="brand">
          <Link to={"/"}>🛒 Cashierless Store</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="toggle-home-navbar" />
        <Navbar.Collapse id="toggle-home-navbar">
          <Nav className="ms-auto nav-item">
            {DashboardNavbarItem.map((item) => (
              <ul key={item.NavText} className="item">
                <Link to={item.NavLink}>
                  <Button
                    variant="link"
                    className="text-decoration-none p-0 text-black"
                  >
                    {item.NavText}
                  </Button>
                </Link>
              </ul>
            ))}
            <ul key="/" className="mb-0">
              <a>
                <Button
                  variant="primary"
                  className="text-white"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </a>
            </ul>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

interface NavbarProps {
  title: string;
  balance: number;
  name: string;
  profileImage: string;
}

export const NavbarComponent: React.FC<NavbarProps> = ({ title, balance, name, profileImage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const wallet = useSelector((state: RootState) => state.auth.wallet);
  const isThai = useSelector((state: RootState) => state.translation.isThai);

  const onLogout = () => {
    dispatch<any>(logout());
    navigate("/");
  };

  return (
    <Navbar bg="light" style={{ zIndex: "1" }}>
      <Container>
        <Navbar.Brand className="ms-2 fw-bold">{title}</Navbar.Brand>
        <Nav className="ms-auto py-1">
          <Nav.Item className="d-none d-sm-flex align-items-center me-3">
            <BsCurrencyExchange className="me-2 fw-bold" style={{ color: "#758096" }} />
            <span className="fw-bold">${wallet?.balance.toFixed(2)}</span>
          </Nav.Item>
          <Nav.Item className="d-flex align-items-center me-3" style={{ cursor: 'pointer' }} onClick={() => dispatch<any>(setIsThai())}>
            <Image
              src={isThai ?
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png" :
                "https://cdn.britannica.com/38/4038-004-111388C2/Flag-Thailand.jpg"}
              roundedCircle
              style={{ width: "25px", height: "25px" }}
              className="align-self-center me-2"
            />
            {isThai ? "EN" : "TH"}
          </Nav.Item>
          <DropdownButton
            align="end"
            variant="align-self-center btn-outline-info"
            title={
              <>
                <Image
                  src={user?.profile_image}
                  roundedCircle
                  style={{ width: "25px", height: "25px" }}
                  className="align-self-center me-1"
                />
                <span>{user?.name}</span>
              </>
            }
            id="dropdown-menu-align-end"
            className="text-white"
          >
            <Dropdown.Item eventKey="1" onClick={onLogout}>{isThai ? "Logout" : "ออกจากระบบ"}</Dropdown.Item>
          </DropdownButton>
        </Nav>
      </Container>
    </Navbar>
  );
};