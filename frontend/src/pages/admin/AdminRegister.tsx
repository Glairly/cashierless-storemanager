import {
  Button,
  Card,
  Col,
  Container,
  Form as BootstrapForm,
  Image,
  Row,
  Modal
} from "react-bootstrap";
import * as Navbar from "../../components/Navbar";
import ShoppingMan from "../../assets/shopping_man.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./AdminRegister.scss";
import { Formik, ErrorMessage, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { registerShop } from "../../app/authAPI";
import * as Yup from "yup";
import { RootState } from "../../app/store";
import { useState } from "react";

interface RegisterShopValues {
  username: string;
  password: string;
  email: string;
  name: string;
  is_shop_owner: boolean;
  gender: "Male" | "Female";
  birth_date: string;
  phone_number: string;
  face_img: string | null;
  shop_name: string | null;
  machine_id: number | null;
  shop_phone_number: string | null;
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
  shop_name: Yup.string()
    .min(4, "* Shop name is too short!")
    .max(20, "* Shop name is too long!")
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
  shop_phone_number: Yup.string().matches(
    phoneRegExp,
    "* Shop phone number is not valid"
  ),
});

const renderForm: React.FC = (initialValues) => {
  const dispatch = useDispatch();
  const msg = useSelector((state: RootState) => state.auth.msg);

  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => setShowAlert(false);

  const handleSubmit = async (values: any) => {
    await dispatch<any>(registerShop(values));
  };

  return (
    <div>
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
            <BootstrapForm.Group className="my-3">
              <BootstrapForm.Label>Shop Name</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="shop_name"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex) HW Cashierless Store"
              />
              <ErrorMessage name="shop_phone_number">
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
              <BootstrapForm.Label>Phone Number</BootstrapForm.Label>
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
              <BootstrapForm.Label>Shop Phone Number</BootstrapForm.Label>
              <BootstrapForm.Control
                type="tel"
                name="shop_phone_number"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex) 0898998999"
              />
              <ErrorMessage name="shop_phone_number">
                {(msg) => <small style={{ color: "red" }}>{msg}</small>}
              </ErrorMessage>
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>Gender</BootstrapForm.Label>
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
      <Modal show={showAlert} onHide={handleCloseAlert}>
        <Modal.Header closeButton>
          <Modal.Title>Notify</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msg}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="text-white" onClick={handleCloseAlert}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AdminRegister: React.FC = () => {
  const initialValues: RegisterShopValues = {
    username: "",
    password: "",
    email: "",
    name: "",
    is_shop_owner: true,
    gender: "Male",
    birth_date: "",
    phone_number: "",
    face_img: null,
    shop_name: "",
    machine_id: 1,
    shop_phone_number: "",
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
                <h4>Store’s Registeration</h4>
                <small>
                  Let’s get you all set up so you can verify your store account
                  <br />
                  and begin setting up your store’s profile
                </small>
                {renderForm(initialValues)}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminRegister;
