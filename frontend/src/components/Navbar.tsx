import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown, Image, Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { logout } from "../features/auth/authAPI";
import { BsCurrencyExchange, BsWalletFill } from "react-icons/bs";

interface item {
  NavText: string;
  NavLink: string;
}
const HomeNavbarItem: item[] = [
  {
    NavText: "Home",
    NavLink: "/",
  },
  {
    NavText: "About Us",
    NavLink: "/AboutUs",
  },
  // {
  //   NavText: "Contact Us",
  //   NavLink: "/ContactUs",
  // },
  {
    NavText: "Product",
    NavLink: "/Product",
  },
];

export const HomeNavbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Navbar bg="white" expand="lg">
      <Container>
        <Navbar.Brand className="brand">
          <Link to={"/"}>🛒 Cashierless Store</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="toggle-home-navbar" />
        <Navbar.Collapse id="toggle-home-navbar">
          <Nav className="ms-auto nav-item">
            {HomeNavbarItem.map((item) => (
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
            <ul className="mb-0">
              {user?.id ? (
                <Link to={"/Dashboard"} className=" ">
                  <Button variant="primary" className="text-white">
                    Your Page
                  </Button>
                </Link>
              ) : (
                <Link to={"/Login"}>
                  <Button variant="primary" className="text-white">
                    Login
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

  return (
    <Navbar bg="light" style={{ zIndex: "9999" }}>
      <Container>
        <Navbar.Brand className="ms-2 fw-bold">{title}</Navbar.Brand>
        <Nav className="ms-auto py-0">
          <Nav.Item className="d-none d-sm-flex align-items-center me-3">
            <BsCurrencyExchange className="me-2 fw-bold" style={{ color: "#758096" }} />
            <span className="fw-bold">${balance.toFixed(2)}</span>
          </Nav.Item>
          <DropdownButton
            align="end"
            variant="primary text-white align-self-center"
            title={
              <>
                <Image
                  src={profileImage}
                  roundedCircle
                  style={{ width: "25px", height: "25px" }}
                  className="align-self-center me-1"
                  alt={"profile_image"}
                />
                <span>{name}</span>
              </>
            }
            id="dropdown-menu-align-end"
            className="text-white"
          >
            <Dropdown.Item eventKey="1">Logout</Dropdown.Item>
          </DropdownButton>
        </Nav>
      </Container>
    </Navbar>
  );
};