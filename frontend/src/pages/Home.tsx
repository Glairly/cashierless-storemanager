import { Button, Col, Container, Row, Image } from "react-bootstrap";
import HomePic from "../assets/homepic1.jpg";
import HomeFooter from "../components/Footer";
import * as Navbar from "../components/Navbar";
import "./Home.scss";

const Home: React.FC = () => {
  return (
    <div>
      <Navbar.HomeNavbar />
      <Container>
        <Row className="py-3 px-4">
          <Col md>
            <h1 className="fw-bold display-5">
              Hello!! <br /> Want To Experience <br /> Contact-Less Store?
            </h1>
          </Col>
          <Col md>
            <h5 className="mb-3">
              Wanna buy stuff but don’t have an account?
              <br />
              Register is the option.
            </h5>
            <Button variant="primary" className="text-white">
              Register
            </Button>
          </Col>
        </Row>
      </Container>
      <Image src={HomePic} alt="Cashierless" />
      <HomeFooter />
    </div>
  );
};

export default Home;
