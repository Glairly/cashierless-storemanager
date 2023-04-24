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

const PersonalInfo: React.FC = () => {

  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const genderOptions = ["Male", "Female", "Non-binary", "Other"];

  const user = useSelector((state: RootState) => state.auth.user);
  const { pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const isThai = useSelector((state: RootState) => state.translation.isThai);

  const [selectedOption, setSelectedOption] = useState(user?.gender);

  const handleSubmitPersonalInfo = async (values: any) => {
    if (isLoading) return;
    if (values.profile_image == "") values.profile_image = user?.profile_image && "";
    dispatch<any>(editClient(values));
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
            onSubmit={handleSubmitPersonalInfo}
            className="mt-4"
          >
            {({ handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <Row className="d-flex justify-content-center">
                  <Col md="3">
                    <BootstrapForm.Group>
                      <div className="d-flex flex-column align-items-center">
                        <p className="mb-2">{isThai ? "Photo" : "รูปถ่าย"}</p>
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
                          {isThai ? "Change Profile Picture" : "เปลี่ยนรูปภ่าย"}
                        </label>
                      </div>
                    </BootstrapForm.Group>
                  </Col>
                  <Col md="6">
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>{isThai ? "Full Name" : "ชื่อเต็ม"}</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="fullname"
                        placeholder="Full Name"
                        defaultValue={user?.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>
                        {isThai ? "Phone Number" : "เบอร์โทรศัพท์"}
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
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Gender</BootstrapForm.Label>
                      <Dropdown className="border rounded-2" defaultValue={user?.gender}>
                        <Dropdown.Toggle variant="secondary" id="gender" className="form-control">
                          {selectedOption || (isThai ? "Select an option" : "โปรดเลือกเพศ")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="form-control">
                          {genderOptions.map((option) => (
                            <Dropdown.Item
                              key={option}
                              onClick={() => {
                                setFieldValue("gender", option);
                                setSelectedOption(option)
                              }}
                            >
                              {option}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </BootstrapForm.Group>
                    <div className="d-flex justify-content-end align-items-center mt-4">
                      <Button type="submit" className="text-white">
                        {isLoading ? (isThai ? "Pending" : "กำลังดำเนินงาน") : (isThai ? "Save Personal Info" : "บันทึกการเปลี่ยนแปลง")}
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

export default PersonalInfo;