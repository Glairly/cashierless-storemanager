import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, LinkProps } from "react-router-dom";

import "./Navbar.scss";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

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
  {
    NavText: "Contact Us",
    NavLink: "/ContactUs",
  },
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
                  <Button variant="link" className="text-decoration-none p-0 text-black">
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
  { NavText: "Home", NavLink: "/" },
  { NavText: "Contact Us", NavLink: "/ContactUs" },
];

export const DashbaordNavbar: React.FC = () => (
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
                <Button variant="link" className="text-decoration-none p-0 text-black">
                  {item.NavText}
                </Button>
              </Link>
            </ul>
          ))}
          <ul className="mb-0">
            <Link to={"/User"}>
              <Button variant="primary" className="text-white">
                User
              </Button>
            </Link>
          </ul>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);