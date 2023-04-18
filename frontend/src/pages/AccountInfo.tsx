import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form as BootstrapForm, InputGroup, Row, Image, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { editClient } from "../features/auth/authAPI";
import Popup from "../components/Popup";
import { setIdle } from "../features/auth/authSlice";

const initialValuesProfile = {
  name: "",
  gender: "",
  profile_image: ""
};

const validationSchema = Yup.object({
  // fullname: Yup.string().required("Required"),
  // phone: Yup.string().required("Required"),
  // gender: Yup.string().required("Required"),
});

const AccountInfo: React.FC = () => {

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

  const [selectedOption, setSelectedOption] = useState(user?.gender);

  const handleSubmitAccountInfo = async (values: any) => {
    if (isLoading) return;
    const { fullname, phone, gender } = values;
    let { profile_image } = values;
    if (profile_image == "") profile_image = user?.profile_image && "";
    dispatch<any>(editClient(fullname, phone, gender, profile_image));
  };

  const onPopupHide = () => {
    dispatch<any>(setIdle());
  };

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

  return (
    <Container className="mt-4">
      <Card className="rounded-4" style={{ border: "2px solid cyan" }}>
        <Card.Body>
          <Formik
            initialValues={initialValuesProfile}
            validationSchema={validationSchema}
            onSubmit={handleSubmitAccountInfo}
            className="mt-4"
          >
            {({ handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <Row className="d-flex justify-content-center">
                  <Col md="6">
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
                  </Col>
                </Row>
              </Form>
            )
            }
          </Formik>
        </Card.Body>
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
  );
}

export default AccountInfo;