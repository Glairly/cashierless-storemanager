import { Button, Card, Col, Container, Image, Row, Form as BootstrapForm, Dropdown, Modal } from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import ShoppingMan from "../assets/shopping_man.png";
import { BsFillBasket2Fill } from "react-icons/bs";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authAPI";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useCallback, useEffect, useRef, useState } from "react";
import Popup from "../components/Popup";
import WebcamComponent from "../components/WebcamComponent";
import Webcam from "react-webcam";
import { recognizeFace } from "../features/inference/inferenceAPI";

interface RegisterValues {
  username: string;
  password: string;
  email: string;
  name: string;
  is_shop_owner: boolean;
  gender: string;
  birth_date: string;
  phone_number: string;
  face_img: string | null;
  profile_img: string | null;
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const MAX_FILE_SIZE: number = 102400; //100KB

const validFileExtensions: { [key: string]: string[] } = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

function isValidFileType(fileName: string, fileType: string): boolean {
  return validFileExtensions[fileType].indexOf(fileName.split('.').pop()!) > -1;
}

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "* Username is too short!")
    .max(20, "* Username is too long!")
    .required("* Required"),
  password: Yup.string()
    .min(6, "* Password is too short!")
    .max(20, "* Password is too long!")
    .required("* Required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
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
  profile_img: Yup.mixed()
    .test('fileFormat', 'Only JPEG, JPG and PNG files are allowed',
      (value) => {
        const formats: string[] = ["jpg", "png", "jpeg"];
        let result: boolean = false;
        formats.forEach((format) => {
          if ((value as String).includes(format))
            result = true;
        })
        return result;
      })
});

const renderForm: React.FC = (props) => {
  const { ...initialValues } = props;
  const dispatch = useDispatch();
  const msg = useSelector((state: RootState) => state.auth.msg);
  const { pendingStatus, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const isThai = useSelector((state: RootState) => state.translation.isThai);
  const genderOptions = ["Male", "Female", "Non-binary", "Other"];

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [isFaceModal, setIsFaceModal] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const handleSubmit = async (values: any) => {
    await dispatch<any>(register(values));
    setShouldShowModal(true);
  };

  const capture = useCallback(async () => {
    setImgSrc("");
    if (isLoading) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const file = imageSrc.split(",", 2)[1];
      setImgSrc(file);
    }
  }, [webcamRef]);

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
    setShouldShowModal(false);
  }, [pendingStatus]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <BootstrapForm.Group className="my-3">
              <BootstrapForm.Label>{isThai ? "Username" : "ผู้ใช้งาน"}</BootstrapForm.Label>
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
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>{isThai ? "Confirm Password" : "ยืนยันรหัสผ่าน"}</BootstrapForm.Label>
              <BootstrapForm.Control
                type="password"
                name="confirm_password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="confirm_password">
                {(msg) => <small style={{ color: "red" }}>{msg}</small>}
              </ErrorMessage>
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>{isThai ? "Email" : "อีเมล"}</BootstrapForm.Label>
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
              <BootstrapForm.Label>{isThai ? "Name" : "ชื่อเต็ม"}</BootstrapForm.Label>
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
              <BootstrapForm.Label>{isThai ? "Birth Date" : "วันเกิด"}</BootstrapForm.Label>
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
              <BootstrapForm.Label>{isThai ? "Phone Number" : "เบอร์โทรศัพท์"}</BootstrapForm.Label>
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
              <BootstrapForm.Label>{isThai ? "Gender" : "เพศ"}</BootstrapForm.Label>
              <Dropdown className="border rounded-2">
                <Dropdown.Toggle variant="secondary" id="gender" className="form-control">
                  {selectedOption || (isThai ? "Select an option" : "โปรดเลือกตัวเลือก")}
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
              <ErrorMessage name="gender">
                {(msg) => <small style={{ color: "red" }}>{msg}</small>}
              </ErrorMessage>
            </BootstrapForm.Group>

            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>{isThai ? "Profile Picture" : "เลือกรูปโปรไฟล์"}</BootstrapForm.Label>
              <BootstrapForm.Control
                type="file"
                accept="image/"
                name="profile_img"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.currentTarget.files) {
                    var reader = new FileReader();
                    reader.readAsDataURL(event.currentTarget.files[0]);
                    if (reader != null) {
                      reader.onload = () => {
                        setFieldValue("profile_img", reader.result)
                      }
                      reader.onerror = (error) => {
                        console.log("Error: " + error);
                      }
                    }
                  }
                }}
                onBlur={handleBlur}
                placeholder="Expected to be in jpeg and png format"
              />
              <ErrorMessage name="profile_img">
                {(msg) => <small style={{ color: "red" }}>{msg}</small>}
              </ErrorMessage>
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-4">
              <div className="d-flex flex-column justify-content-center rounded align-items-stretch">
                <BootstrapForm.Label>{isThai ? "Face detection" : "ระบบจดจำใบหน้า"}</BootstrapForm.Label>
                <Button
                  variant={`${!imgSrc ? "danger" : "success"} text-white`}
                  onClick={() => setIsFaceModal(true)}>
                  {!imgSrc ?
                    (isThai ? "Click to Capture Face Image" : "กดเพื่อถ่ายรูป") : (
                      isThai ? "Capture Image Done!" : "ถ่ายรูปสำเร็จ")}
                </Button>
              </div>
            </BootstrapForm.Group>

            <Button type="submit" variant="primary" className="text-white w-100">
              {isThai ? "Submit" : "ลงทะเบียน"}
            </Button>

            <Modal show={isFaceModal} onHide={() => setIsFaceModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{isThai ? "Face detection" : "ระบบจดจำใบหน้า"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="d-flex flex-column justify-content-center rounded align-items-stretch h-100">
                  {!imgSrc ? <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" /> : <Image src={"data:image/jpeg;base64," + imgSrc} />}
                  <Button
                    variant={`${!imgSrc ? "danger" : "success"} text-white my-2`}
                    onClick={capture}
                  >
                    {!imgSrc ? (isThai ? "Capture Image" : "จับภาพถ่าย") : (isThai ? "Recapture Image" : "จับภาพอีกครั้ง")}
                  </Button>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setIsFaceModal(false); setFieldValue("face_img", imgSrc); }}>
                  {isThai ? "Close" : "ยกเลิก"}
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      </Formik>
      <Popup
        show={shouldShowModal}
        title="Notify"
        body={msg || ""}
        status={modalStatus}
        onHide={() => {
          setShouldShowModal(false);
        }}
      />
    </div>
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
    birth_date: "2005-01-01",
    phone_number: "",
    face_img: null,
    profile_img: null,
  };

  const isThai = useSelector((state: RootState) => state.translation.isThai);

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
                <h4>{isThai ? "Register" : "ลงทะเบียน"}</h4>
                <small>
                  {isThai ?
                    (<>Let's get you all set up so you can verify your
                      < br /> personal account and begin setting up your profile</>
                    ) : (
                      <>เพื่อเป็นการเตรียมพร้อมให้คุณเข้าสู่ระบบของเรา <br />
                        คุณจะต้องกรอกข้อมูลส่วนตัวและข้อมูลบัญชีเพื่อเป็นการยืนยันตน</>
                    )}
                </small>
                {renderForm(initialValues)}
                <Row>
                  <small className="mt-5 text-center">
                    {isThai ? "Want to register as Store Manager?" : "ต้องการลงทะเบียนในฐานะร้านค้า?"}
                    <Link
                      to={"/Admin/Register"}
                      className="ms-2 text-decoration-none"
                    >
                      {isThai ? "Sign Up" : "ลงทะเบียนเลย!"}
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
