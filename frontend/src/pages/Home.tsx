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
            <p className="home-body-title">{isThai ? "Experience the Contact Less Store" : "สัมผัสประสบการณ์ใหม่กับร้านค้าไร้พนักงาน"}</p>
            <p className="home-body-subtitle">{isThai ? "Just grab, pay & go" : "เพียง หยิบวาง จ่ายเงิน เสร็จสิ้นกระบวนการ"}</p>
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
                {isThai ? (
                  <span>
                    Get the most out of our product. <b>Signup now!</b> to create
                    your account and enjoy the ultimate shopping experience!
                  </span>
                ) : (
                  <span>
                    หากต้องการใช้งานได้อย่างเต็มรูปแบบเพียง<b>ลงทะเบียนเข้าใช้งาน! </b>
                    เพื่อรับประสบการณ์ที่ไม่เหมือนใครในการช็อปปิ้งกับระบบของเรา
                  </span>
                )}
              </h4>
              <Link to="/Register">
                <Button variant="primary" className="text-white register-btn">
                  {isThai ? "Go to Sign Up" : "ลงทะเบียน"}
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
                {isThai ? (
                  <span>
                    Get our machine. <b>Register Your Shop now!</b> and get started
                    your new contact-Less business.
                  </span>
                ) : (
                  <span>
                    รับเครื่องคิดเงินของเราเพื่อใช้งานกับร้านค้าของตนเอง <b>ลงทะเบียนเข้าใช้งานแบบร้านค้า! </b>
                    เพื่อเริ่มใช้งานระบบร้านค้าไร้พนักงานของเรา
                  </span>
                )}
              </h4>
              <Link to="/Admin/Register">
                <Button variant="primary" className="text-white register-btn">
                  {isThai ? "Register Your Shop" : "ลงทะเบียนแบบร้านค้า"}
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
