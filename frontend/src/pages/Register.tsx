import { Button, Card, Col, Container, Image, Row, Form as BootstrapForm } from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import ShoppingMan from "../assets/shopping_man.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { register } from "../app/authAPI";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface RegisterValues {
  username: string;
  password: string;
  email: string;
  name: string;
  is_shop_owner: false;
  gender: "Male" | "Female";
  birth_date: string;
  phone_number: string;
  face_img: string | null;
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alertMsg = useSelector((state: RootState) => state.auth.msg);

  const handleSubmit = async (values: any) => {
    await dispatch<any>(register(values));
    alert(alertMsg);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur }) => (
        <Form>
          <BootstrapForm.Group className="my-3">
            <BootstrapForm.Label>Username</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="JBrown"
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
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Email</BootstrapForm.Label>
            <BootstrapForm.Control
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex) john@gmail.com"
            />
            <ErrorMessage name="email">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Name</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex) John Brown"
            />
            <ErrorMessage name="name">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Birth Date</BootstrapForm.Label>
            <BootstrapForm.Control
              type="date"
              name="birth_date"
              onChange={handleChange}
              defaultValue={"2005-01-01"}
            />
            <ErrorMessage name="birth_date">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Phone number</BootstrapForm.Label>
            <BootstrapForm.Control
              type="tel"
              name="phone_number"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex) 0898998999"
            />
            <ErrorMessage name="phone_number">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Password</BootstrapForm.Label>
            <BootstrapForm.Check type="radio" label="Male" name="gender" id="male" defaultChecked={true} />
            <BootstrapForm.Check type="radio" label="Female" name="gender" id="female" />
            <ErrorMessage name="gender">
              {(msg) => <small style={{ color: "red" }}>{msg}</small>}
            </ErrorMessage>
          </BootstrapForm.Group>
          <Button type="submit" variant="primary" className="text-white w-100">
            Submit
          </Button>
        </Form>
      )}
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
    face_img: null,
  };

  return (
    <div className="register">
      <Navbar.HomeNavbar />
      <Container className="p-4">
        <Row className="justify-content-center align-items-center">
          <Col lg={4} className="d-none d-lg-block">
            <Image src={ShoppingMan} alt="" fluid />
          </Col>
          <Col lg={6}>
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
