import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import ShoppingMan from "../assets/shopping_man.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./Register.scss";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { DateSelector } from "../components/Formik/DateSelector";

interface RegisterValues {
  username: string;
  password: string;
  email: string;
  name: string;
  is_shop_owner: false;
  gender: "Male" | "Female";
  birth_date: string;
  phone_number: string;
  face_img: string;
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "* Username is too short!")
    .max(20, "* Username is too long!")
    .required("* Required"),
  password: Yup.string()
    .min(6, "* Password is too short!")
    .max(20, "* Password is too long!")
    .required("* Required"),
  email: Yup.string().email("* Invalid email").required("* Required"),
  name: Yup.string()
    .min(4, "* Name is too short!")
    .max(50, "* Name is too long!")
    .required("* Required"),
  birth_date: Yup.date()
    .max(new Date(Date.now() - 567648000000), "* You must be at least 18 years")
    .required("* Required"),
  phone_number: Yup.string().matches(
    phoneRegExp,
    "* Phone number is not valid"
  ),
});

const renderForm: React.FC = (initialValues) => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={async (values, actions) => {
        const json = JSON.stringify(values);
        const temp = JSON.parse(json);
        temp.birth_date = temp.birth_date.split("T")[0];
        temp.face_img =
          "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";
        alert(JSON.stringify(temp, null, 2));
        actions.setSubmitting(false);

        try {
          const response = await fetch("http://localhost:8000/capi/v1/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(temp),
          });
          const data = await response.json();
          console.log("Register", data);
        } catch (error) {
          console.error("Register Error:", error);
        }
      }}
    >
      <Form className="my-3">
        <div className="d-flex flex-column mb-3">
          <label className="mb-1">Username</label>
          <Field
            id="username"
            type="text"
            name="username"
            placeholder="Username"
          />
          <ErrorMessage name="username">
            {(msg) => <small style={{ color: "red" }}>{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="mb-1">Password</label>
          <Field
            id="password"
            type="password"
            name="password"
            placeholder="Contain aria wa"
          />
          <ErrorMessage name="password">
            {(msg) => <small style={{ color: "red" }}>{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="mb-1">Email</label>
          <Field
            id="email"
            type="email"
            name="email"
            placeholder="hwlab504@bing.com"
          />
          <ErrorMessage name="email">
            {(msg) => <small style={{ color: "red" }}>{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="mb-1">Name</label>
          <Field
            id="name"
            type="text"
            name="name"
            placeholder="Warit Chan-o-cha"
          />
          <ErrorMessage name="name">
            {(msg) => <small style={{ color: "red" }}>{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="mb-1">Gender</label>
          <div className="d-flex justify-content-around">
            <div>
              <Field id="radio1" type="radio" name="gender" value="Male" />
              <label>Male</label>
            </div>
            <div>
              <Field id="radio2" type="radio" name="gender" value="Female" />
              <label>Female</label>
            </div>
          </div>
          <ErrorMessage name="radio">
            {(msg) => <small style={{ color: "red" }}>{msg}</small>}
          </ErrorMessage>
        </div>
        <DateSelector name={"birth_date"} />
        <div className="d-flex flex-column mb-3">
          <label className="mb-1">Phone Number</label>
          <Field
            id="phone_number"
            type="tel"
            name="phone_number"
            placeholder="0898998999"
          />
          <ErrorMessage name="name">
            {(msg) => <small style={{ color: "red" }}>{msg}</small>}
          </ErrorMessage>
        </div>
        <Button variant="primary" type="submit" className="w-100 text-white">
          Submit
        </Button>
      </Form>
    </Formik>
  );
};

const Register: React.FC = () => {
  const initialValues: RegisterValues = {
    username: "",
    password: "",
    email: "",
    name: "",
    is_shop_owner: false,
    gender: "Male",
    birth_date: "",
    phone_number: "",
    face_img:
      "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
  };

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
                <h4>Register</h4>
                <small>
                  Let's get you all set up so you can verify your
                  <br /> personal account and begin setting up your profile
                </small>
                {renderForm(initialValues)}
                <Row>
                  <small className="mt-5 text-center">
                    Want to register as Store Manager?
                    <Link
                      to={"/Admin/Register"}
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

export default Register;
