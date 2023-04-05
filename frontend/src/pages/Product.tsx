import { Col, Container, Row } from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import "./Product.scss";
import MachineSVG from "./svgs/MachineSVG";
import HomeFooter from "../components/Footer";

const Product: React.FC = () => {
  return (
    <div className="product-body">
      <Navbar.HomeNavbar />
      <Container className="product-content">
        <Row>
          <Col md>
            <p className="product-title">A Store Management System</p>
            <p className="product-subtitle mt-4">
              We have machine that provide a cashierless solution for your store
              cashier section with a product management system built-in
            </p>
          </Col>
          <hr className="my-4" />
        </Row>
        <Row>
          <Col md>
            <p className="product-title">The Machine</p>
            <p className="product-subtitle mt-4">Machine technology</p>
            <div className="d-flex justify-content-center m-4">
              <MachineSVG />
            </div>
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </div>
  );
};

export default Product;
