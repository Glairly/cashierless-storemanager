import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarComponent } from "../components/Navbar";
import Sidebar from "../components/Sidebar"
import NewDashboard from "./NewDashboard";
import { ReactNode, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

interface LayoutProp {
  navTitle: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProp> = ({ navTitle, children }) => {
  return (
    <Container>
      <div className="d-flex">
        <Sidebar active={navTitle} />
        <div className="col">
          <NavbarComponent
            title={navTitle}
            balance={248.00}
            name="Supakit Lokaew"
            profileImage="https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg"
          />
          {/* <Routes>
          <Route path="/new" element={
            <> */}
          {children}
          {/* </>
          }
          />
        </Routes> */}
        </div>
      </div>
    </Container>

  )
}

export default Layout;