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
import { editAuth, editClient } from "../app/authAPI";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";

const initialValuesProfile = {
  name: "",
  gender: "",
  profile_image: ""
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
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const genderOptions = ["Male", "Female", "Non-binary", "Other"];

  const user = useSelector((state: RootState) => state.auth.user);
  const auth = useSelector((state: RootState) => state.auth.auth);

  const { pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    switch (pendingStatus) {
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
    let { profile_image } = values;
    if (profile_image == "") profile_image = user?.profile_image && "";
    dispatch<any>(editClient(fullname, phone, gender, profile_image));
  };

  const handleSubmitAccountInfo = async (values: any) => {
    if (isLoading) return;
    const { email, password, confirmpassword } = values;
    dispatch<any>(editAuth(email, password, confirmpassword));
  };

  return (
    <div className="profile">
      <Navbar.DashbaordNavbar />
      <Container className="py-4">
        {isLoading ? "Load" : "not load"}
        {error ? error : "No error"}
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
                <Formik
                  initialValues={initialValuesProfile}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmitPersonalInfo}
                  className="mt-4"
                >
                  {({ handleChange, handleBlur, setFieldValue }) => (
                    <Form>
                      <div className="mt-4">
                        <h3 className="">Personal Info</h3>
                        <hr className="my-2"></hr>
                      </div>
                      <BootstrapForm.Group className="mb-2">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <p className="mt-4 mb-2">Photo</p>
                          <Image
                            className="profile-img rounded-5"
                            rounded
                            src={profileImage ? profileImage : user?.profile_image}
                          />
                          <input
                            type="file"
                            id="profile_image"
                            accept=".jpeg,.png,.jpg"
                            className="d-none"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              if (event.currentTarget.files) {
                                var reader = new FileReader();
                                reader.readAsDataURL(event.currentTarget.files[0]);
                                if (reader != null) {
                                  reader.onload = () => {
                                    const decoder = new TextDecoder();
                                    setFieldValue("profile_image", reader.result);
                                    if (typeof (reader.result) === "string") {
                                      setProfileImage(reader.result)
                                    }
                                  }
                                  reader.onerror = (error) => {
                                    console.log("Error: " + error);
                                  }
                                }
                              }
                            }}
                          />
                          <label
                            htmlFor="profile_image"
                            className="btn btn-primary text-white my-3"
                          >
                            Change Picture
                          </label>
                        </div>
                      </BootstrapForm.Group>

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
            setShouldShowModal(false);
          }}
        />
      </Container>
    </div>
  );
};

export default Profile;
