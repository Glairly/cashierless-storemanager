import { Button, Col, Container, Row, Image } from "react-bootstrap";
import HomePic from "../assets/homepic1.jpg";
import HomeFooter from "../components/Footer";
import * as Navbar from "../components/Navbar";
import "./Home.scss";
import CustomerSVG from "./svgs/CustomerSVG";
import StoreSVG from "./svgs/StoreSVG";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";

const Home: React.FC = () => {

  const isThai = useAppSelector((state: RootState) => state.translation.isThai)

  return (
    <div className="home-body">
      <Navbar.HomeNavbar />
      <Container className="home-content">
        <Row>
          <Col md>
            <p className="home-body-title">{isThai ? "Experience the Contact Less Store" : "สัมผัสประสบการณ์กับร้านค้าไร้พนักงาน"}</p>
            <p className="home-body-subtitle">Just grab, pay & go</p>
          </Col>
        </Row>
        <Row className="px-5 my-5">
          <hr></hr>
        </Row>
        <Row className="home-content-card-wrappper">
          <Col md>
            <div className="home-body-card">
              <h4>
                <CustomerSVG />
                <br />
                <br />
                Get the most out of our product. <b>Singup now!</b> to create
                your account and enjoy the ultimate shopping experience!
              </h4>
              <Link to="/Register">
                <Button variant="primary" className="text-white register-btn">
                  Go to Sign Up
                </Button>
              </Link>
            </div>
          </Col>
          <Col md>
            <div className="home-body-card">
              <h4>
                <StoreSVG />
                <br />
                <br />
                Get our machine. <b>Register Your Shop now!</b> and get started
                your new contact-Less business.
              </h4>
              <Link to="/Admin/Register">
                <Button variant="primary" className="text-white register-btn">
                  Register Your Shop
                </Button>
              </Link>
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
