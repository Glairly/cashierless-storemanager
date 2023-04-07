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
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { login } from "../features/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

const initialValues = {
  grant_type: "",
  username: "",
  password: "",
  scope: "",
  client_id: "",
  client_secret: "",
};

const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});


const renderLoginForm: React.FC = (initialValues) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    const { username, password } = values;
    dispatch<any>(login(username, password));
  };

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token)
      navigate("/dashboard")
  }, [token])


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
          <Button type="submit" variant="primary" className="text-white w-100">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const Login: React.FC = () => {
  return (
    <div className="login">
      <Navbar.HomeNavbar />
      <Container className="p-4">
        <Row className="justify-content-center align-items-center">
          <Col lg={4} className="d-none d-lg-block">
            <Image src={ShoppingWomen} alt="" fluid />
          </Col>
          <Col lg={6}>
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
