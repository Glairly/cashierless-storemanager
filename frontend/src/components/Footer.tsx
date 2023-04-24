import { Col, Container, Row } from "react-bootstrap";
import { BsFillTelephoneFill, BsFillEnvelopeFill, BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./Footer.scss";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";

const HomeFooter: React.FC = () => {

  const isThai = useAppSelector((state: RootState) => state.translation.isThai)

  return (
    <footer className="pt-5 pb-4 footer">
      <Container>
        <Row>
          <Col lg={4} xs={12} className="about-company mb-4">
            <h3>{isThai ? "Cashierless Store" : "ร้านค้าไร้พนักงาน"}</h3>
            <p className="pr-5 text-white-50">
              {isThai ? (
                <span>Follow us on our social media <br />
                  to keep track on out next project.</span>
              ) : (
                <span>
                  ติดตามพวกเราบนโซเชี่ยวมีเดีย<br />
                  เพื่อติดตามโปรเจคใหม่ๆของเรา
                </span>
              )}
            </p>
            <a href="https://www.facebook.com" className="me-3"><BsFacebook size={25} /></a>
            <a href="https://www.instagram.com" className="me-3"><BsInstagram size={25} /></a>
            <a href="https://www.twitter.com"><BsTwitter size={25} /></a>
          </Col>
          <Col lg={3} xs={12} className="links mb-4">
            <h4 className="mt-lg-0 mt-sm-3">Links</h4>
            <ul>
              <li>
                <Link to={"/Home"}>{isThai ? "Home" : "หน้าหลัก"}</Link>
              </li>
              <li>
                <Link to={"/About"}>{isThai ? "About Us" : "เกี่ยวกับเรา"}</Link>
              </li>
              <li>
                <Link to={"/Product"}>{isThai ? "Product" : "สินค้าและบริการ"}</Link>
              </li>
            </ul>
          </Col>
          <Col lg={4} xs={12} className="location">
            <h4 className="mt-lg-0 mt-sm-4">{isThai ? "Location" : "สถานที่ติดต่อ"}</h4>
            {isThai ? (
              <p>ECC Building Moo 1 Ladkrabang 1, Chalongkrung Road, 22 Lam Prathew, Lat Krabang, Bangkok 10520</p>
            ) : (
              <p>อาคารปฏิบัติการรวมวิศวกรรมศาสตร์ 2 (ECC) เลขที่ 1 ซอยฉลองกรุง 1 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพมหานคร 10520</p>
            )}
            <p className="mb-0"><i className="m-2"><BsFillTelephoneFill /></i>+66 97 997 7799</p>
            <p><i className="m-2"><BsFillEnvelopeFill /></i>hardware504@gmail.com</p>
          </Col>
        </Row>

        <div className="row mt-3">
          <div className="col copyright">
            <p className=""><small className="text-white-50">© 2023. All Rights Reserved.</small></p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default HomeFooter;