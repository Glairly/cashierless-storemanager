import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form as BootstrapForm, InputGroup, Row, Image, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Popup from "../components/Popup";
import { setIdle } from "../features/auth/authSlice";
import { editAuth } from "../features/auth/authAPI";

const initialValuesProfile = {
  email: "",
  password: "",
  confirmPassword: ""
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

  const auth = useSelector((state: RootState) => state.auth.auth);

  const { pendingStatus, isLoading, error, msg } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmitAccountInfo = async (values: any) => {
    // if (isLoading) return;
    console.log("Hello world")
    dispatch<any>(editAuth(values));
  };

  const onPopupHide = () => {
    dispatch<any>(setIdle());
  };

  useEffect(() => {
    dispatch<any>(setIdle());
  }, [dispatch])

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
                        value={auth?.email}
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
                        name="confirmPassword"
                        placeholder="Has to be 8 letter or longer"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </BootstrapForm.Group>
                    <div className="d-flex justify-content-end align-items-center mt-4">
                      <Button type="submit" className="text-white" disabled={isLoading}>
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
        body={msg || ""}
        status={modalStatus}
        onHide={() => {
          onPopupHide();
        }}
      />
    </Container>
  );
}

export default AccountInfo;