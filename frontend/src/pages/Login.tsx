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
  const isThai = useSelector((state: RootState) => state.translation.isThai);

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
            <BootstrapForm.Label>{isThai ? "Username" : "ผู้เข้าใช้งาน"}</BootstrapForm.Label>
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
            <BootstrapForm.Label>{isThai ? "Password" : "รหัสผ่าน"}</BootstrapForm.Label>
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
            <BootstrapForm.Check type="checkbox" label={isThai ? "Remember Me" : "จดจำรหัสผ่านในครั้งถัดไป"} />
          </BootstrapForm.Group>
          <Button type="submit" variant="primary" className="text-white w-100">
            {isThai ? "Submit" : "ยืนยัน"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const Login: React.FC = () => {

  const isThai = useSelector((state: RootState) => state.translation.isThai);

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
                <h4 className="text-center">{isThai ? "Hello there!" : "สวัสดีครับ!"}</h4>
                <p className="text-center">
                  {isThai ? "Welcome to Cashierless Store" : "ยินดีต้อนรับสู่ระบบจัดการร้านค้าไร้พนักงาน"} <br />
                  {isThai ? "Please login to enable to use the shop" : "โปรดทำงานล็อคอินเพื่อใช้งานร้านค้า"}
                </p>
                {renderLoginForm(initialValues)}
                <Row>
                  <small className="mt-5 text-center">
                    {isThai ? "Don't have an account yet?" : "ยังไม่มีบัญชีของเราใช่หรือไม่?"}
                    <Link
                      to={"/Register"}
                      className="ms-2 text-decoration-none"
                    >
                      {isThai ? "Sign Up!" : "สมัครใช้งานเลย!"}
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
