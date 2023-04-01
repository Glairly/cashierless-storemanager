import { Button, Col, Container, Row, Image } from "react-bootstrap";
import HomePic from "../assets/homepic1.jpg";
import HomeFooter from "../components/Footer";
import * as Navbar from "../components/Navbar";
import "./Home.scss";

const Home: React.FC = () => {
  return (
    <div className="home-body">
      <Navbar.HomeNavbar />
      <Container className="home-content">
        <Row>
          <Col md>
            <p className="home-body-title">
              Experience the Contactless Store 
            </p>
            <p className="home-body-subtitle">
              Just grab, pay & go 
            </p>
          </Col>
        </Row>
        <Row className="px-5 my-5">
          <hr>
          </hr>
        </Row>
        <Row className="home-content-card-wrappper">
          <Col md>
            <div className="home-body-card">
              <h4>
              Get the most out of our machine. <br/> <b>Singup now!</b> to create your account and enjoy the ultimate shopping experience!
              </h4>
              <Button variant="primary" className="text-white register-btn">
                Go to Sign Up
              </Button>
            </div>
          </Col>
          <Col md>
            <div className="home-body-card">
              <h4>
              Get the most out of our machine. <br/> <b>Register Your Shop now!</b> to create your account and enjoy the ultimate shopping experience!
              </h4>
              <Button variant="primary" className="text-white register-btn">
                Register Your Shop
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="home-image-wrapper">
          <Image src={HomePic} alt="Cashierless" />
        </Row>
      </Container>
      <HomeFooter />
    </div>
  );
};

export default Home;
