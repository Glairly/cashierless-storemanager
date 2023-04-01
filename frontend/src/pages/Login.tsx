import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import ShoppingWomen from "../assets/shopping_women.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./Login.scss";
import { Link } from "react-router-dom";
import React from "react";

const HTMLForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <form>
      <div className="formRow">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          name="email"
          className="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="formRow">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const Login: React.FC = () => {
  return (
    <div className="login">
      <Navbar.HomeNavbar />
      <Container className="p-4">
        <Row className="justify-content-center align-items-center">
          <Col lg={5} className="d-none d-lg-block">
            <Image src={ShoppingWomen} alt="" fluid />
          </Col>
          <Col lg={5}>
            <Card className="py-5 rounded-5 align-items-center">
              <BsFillBasket2Fill size={30} className="basket-icon" />
              <Card.Body>
                <h4 className="text-center">Hello there!</h4>
                <p className="text-center">
                  Welcome to Hardware Shop <br /> Please login to enable to use
                  the shop
                </p>
                <Form className="mt-4">
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formCheckbox">
                    <Form.Check type="checkbox" label="Remember Me" />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="text-white w-100"
                  >
                    Login
                  </Button>
                </Form>
                <Row>
                  <small className="mt-5 text-center">
                    Don't have an account yet?
                    <Link
                      to={"/Register"}
                      className="ms-2 text-decoration-none"
                    >
                      Sign Up
                    </Link>
                  </small>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
