import { Col, Container, Row } from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import HomeFooter from "../components/Footer";
import './AboutUs.scss'

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-body">
      <Navbar.HomeNavbar />
      <Container className="about-us-content">
        <Row>
          <Col md>
            <p className="about-us-title">About us</p>
            <p className="about-us-subtitle mt-4">
              We have machine that provide a cashierless solution for your store
              cashier section with a product management system built-in
            </p>
          </Col>
          <hr className="my-4" />
        </Row>
      </Container>
      <HomeFooter />
    </div>
  );
};

export default AboutUs;
