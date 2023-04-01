import {
  Button,
  Card,
  Col,
  Container,
  Form as BootstrapForm,
  Image,
  Row,
} from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import ShoppingWomen from "../assets/shopping_women.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./Login.scss";
import { Link } from "react-router-dom";
import React from "react";
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from "formik";


const initialValues = {
  grant_type: '',
  username: '',
  password: '',
  scope: '',
  client_id: '',
  client_secret: ''
}

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
})

const handleSubmit = async (values: any) => {
  var formBody: any = [];
  for (var property in values) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(values[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  alert(formBody);

  try {
    const response = await fetch("http://localhost:8000/capi/v1/login", {
      body: formBody,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    const data = await response.json();
    console.log("Login", data);
  } catch (error) {
    console.error("Login Error:", error);
  }

  // Todo: access token -> dashboard page
};

const renderLoginForm: React.FC = (initialValues) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur }) => (
        <Form>
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Username</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage name="username">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Password</BootstrapForm.Label>
            <BootstrapForm.Control
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="password">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="mb-3" controlId="formCheckbox">
            <BootstrapForm.Check type="checkbox" label="Remember Me" />
          </BootstrapForm.Group>
          <Button
            type="submit"
            variant="primary"
            className="text-white w-100"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

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
                {renderLoginForm(initialValues)}
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
