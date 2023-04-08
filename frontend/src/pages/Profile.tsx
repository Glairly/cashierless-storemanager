import {
  Button,
  Col,
  Container,
  Form as BootstrapForm,
  Row,
  Image,
  Card,
} from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import "./profile.scss";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editAuth, editClient } from "../features/auth/authAPI";
import Popup from "../components/Popup";
import { setIdle } from "../features/auth/authSlice";

const initialValues = {
  email: "",
  password: "",
  confirmpassword: "",
  photo:
    "https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg",
};

const initialValues2 = {
  email: "",
  password: "",
  confirmpassword: "",
};

const validationSchema = Yup.object({
  // fullname: Yup.string().required("Required"),
  // phone: Yup.string().required("Required"),
  // gender: Yup.string().required("Required"),
});

const validationSchema2 = Yup.object({
  // email: Yup.string().required("Required"),
  // password: Yup.string().required("Required"),
  // confirmpassword: Yup.string().required("Required"),
});

const Profile: React.FC = () => {
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);

  const genderOptions = ["Male", "Female", "Non-binary", "Other"];

  const user = useSelector((state: RootState) => state.auth.user);
  const auth = useSelector((state: RootState) => state.auth.auth);

  const { pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    switch (pendingStatus) {
      case "idle":
        setShouldShowModal(false);
        break;
      case "pending":
        setShouldShowModal(false);
        break;
      case "fulfilled":
        setShouldShowModal(true);
        setModalStatus(true);
        break;
      case "rejected":
        setShouldShowModal(true);
        setModalStatus(false);
        break;
    }
  }, [pendingStatus]);

  const handleSubmitPersonalInfo = async (values: any) => {
    if (isLoading) return;
    const { fullname, phone, gender } = values;
    dispatch<any>(editClient(fullname, phone, gender));
  };

  const handleSubmitAccountInfo = async (values: any) => {
    if (isLoading) return;
    const { email, password, confirmpassword } = values;
    dispatch<any>(editAuth(email, password, confirmpassword));
  };

  const onPopupHide = () => {
    dispatch<any>(setIdle());
  };

  return (
    <div className="profile">
      <Navbar.DashbaordNavbar />
      <Container className="py-4">
        <Card className="rounded-5">
          <Row className="d-flex flex-row justify-content-center">
            <Col lg={8} className="py-2 px-4">
              <Card.Body>
                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex flex-column">
                    <h2 className="d-inline mb-0">Edit Profile</h2>
                    <p className="d-inline mb-0" style={{ color: "gray" }}>
                      Store Manager will get to see you with the information
                      below
                    </p>
                  </div>
                </div>
                <Row className="d-flex justify-content-center mt-4">
                  <Col lg={4} className="d-flex flex-column align-items-center">
                    <p className="mt-4 mb-2">Photo</p>
                    <Image
                      className="profile-img rounded-5"
                      fluid
                      rounded
                      src={initialValues.photo}
                    />
                    <Button className="text-white mt-3">Change</Button>
                  </Col>
                  <Col lg={8}>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmitPersonalInfo}
                      className="mt-4"
                    >
                      {({ handleChange, handleBlur }) => (
                        <Form>
                          <div className="mt-4 mb-4">
                            <h3 className="">Personal Info</h3>
                            <hr className="my-2"></hr>
                          </div>
                          <BootstrapForm.Group className="mb-2">
                            <BootstrapForm.Label>Full Name</BootstrapForm.Label>
                            <BootstrapForm.Control
                              type="text"
                              name="fullname"
                              placeholder="Full Name"
                              defaultValue={user?.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </BootstrapForm.Group>

                          <BootstrapForm.Group className="mb-2">
                            <BootstrapForm.Label>Gender</BootstrapForm.Label>
                            <Field
                              as="select"
                              name="gender"
                              className="form-control"
                              defaultValue={user?.gender}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Not specified</option>
                              {genderOptions.map((gender) => (
                                <option key={gender} value={gender}>
                                  {gender}
                                </option>
                              ))}
                            </Field>
                          </BootstrapForm.Group>

                          <BootstrapForm.Group className="mb-2">
                            <BootstrapForm.Label>
                              Phone Number
                            </BootstrapForm.Label>
                            <BootstrapForm.Control
                              type="tel"
                              name="phone"
                              defaultValue={user?.phone_number}
                              placeholder="Enter your phone number"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </BootstrapForm.Group>

                          <div className="d-flex justify-content-end align-items-center mt-4">
                            <Button type="submit" className="text-white">
                              {isLoading ? "Pending" : "Save"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>

                    <Formik
                      initialValues={initialValues2}
                      validationSchema={validationSchema2}
                      onSubmit={handleSubmitAccountInfo}
                      className="mt-4"
                    >
                      {({ handleChange, handleBlur }) => (
                        <Form>
                          <div className="mt-4 mb-4">
                            <h3 className="">Account Info</h3>
                            <hr className="my-2"></hr>
                          </div>

                          <BootstrapForm.Group className="mb-2">
                            <BootstrapForm.Label>Email</BootstrapForm.Label>
                            <BootstrapForm.Control
                              type="email"
                              placeholder="Email"
                              name="email"
                              defaultValue={auth?.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </BootstrapForm.Group>

                          <BootstrapForm.Group className="mb-2">
                            <BootstrapForm.Label>Password</BootstrapForm.Label>
                            <BootstrapForm.Control
                              type="password"
                              name="password"
                              placeholder="Has to be 8 letter or longer"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </BootstrapForm.Group>

                          <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>
                              Confirm Password
                            </BootstrapForm.Label>
                            <BootstrapForm.Control
                              type="password"
                              name="confirmpassword"
                              placeholder="Has to be 8 letter or longer"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </BootstrapForm.Group>
                          <div className="d-flex justify-content-end align-items-center mt-4">
                            <Button type="submit" className="text-white">
                              {isLoading ? "Pending" : "Save"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Col>
                </Row>
              </Card.Body>
            </Col>
            <Col lg={4} className="p-0">
              <Image
                className="w-100 h-100"
                style={{ borderRadius: "0 32px 32px 0 !important" }}
                src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg"
              ></Image>
            </Col>
          </Row>
        </Card>

        <Popup
          show={shouldShowModal}
          title="Result"
          body={error || ""}
          status={modalStatus}
          onHide={() => {
            onPopupHide();
          }}
        />
      </Container>
    </div>
  );
};

export default Profile;
