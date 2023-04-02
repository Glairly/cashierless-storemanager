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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    dispatch<any>(register(values));
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
    face_img:
      "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
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
