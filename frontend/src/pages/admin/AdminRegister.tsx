import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import * as Navbar from "../../components/Navbar";
import ShoppingMan from "../../assets/shopping_man.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./AdminRegister.scss";
import { Link } from "react-router-dom";

const AdminRegister: React.FC = () => {
  return (
    <div className="register">
      <Navbar.HomeNavbar />
      <Container className="p-4">
        <Row className="justify-content-center align-items-center">
          <Col lg={5} className="d-none d-lg-block">
            <Image src={ShoppingMan} alt="" fluid />
          </Col>
          <Col lg={5}>
            <Card className="py-5 rounded-5 align-items-center">
              <Card.Body>
                <BsFillBasket2Fill size={30} className="basket-icon mb-3" />
                <h4>Store’s Registeration</h4>
                <small>
                  Let’s get you all set up so you can verify your store account
                  <br />
                  and begin setting up your store’s profile
                </small>
                <Form className="mt-4">
                  <Form.Group className="mb-2" controlId="formStoreName">
                    <Form.Label>Store Name</Form.Label>
                    <Form.Control
                      type="storeName"
                      placeholder="Ex. Hardware Store"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ex. warit@bing.com"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Has to be 8 letter or longer"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Has to be 8 letter or longer"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPolicy">
                    <Form.Check type="checkbox" label="Policy" />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    <Link
                      to={"/Admin/Dashboard"}
                      className="text-white ms-2 text-decoration-none"
                    >
                      Register
                    </Link>
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminRegister;
