import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form as BootstrapForm, InputGroup, Row, Image, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Popup from "../components/Popup";
import { setIdle } from "../features/auth/authSlice";
import { editAuth, editShop } from "../features/auth/authAPI";

const validationSchema = Yup.object({
  // fullname: Yup.string().required("Required"),
  // phone: Yup.string().required("Required"),
  // gender: Yup.string().required("Required"),
});

const ShopSetting: React.FC = () => {

  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const shop = useSelector((state: RootState) => state.auth.shop);

  const { pendingStatus, isLoading, error, msg } = useSelector(
    (state: RootState) => state.auth
  );
  const isThai = useSelector((state: RootState) => state.translation.isThai);

  const initialValuesShop = {
    name: "",
    phone_number: ""
  };

  const handleSubmitShopSetting = async (values: any) => {
    dispatch<any>(editShop(values));
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
            initialValues={initialValuesShop}
            validationSchema={validationSchema}
            onSubmit={handleSubmitShopSetting}
            className="mt-4"
          >
            {({ handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <Row className="d-flex justify-content-center">
                  <Col md="8">
                    <BootstrapForm.Group className="mb-2">
                      <BootstrapForm.Label>{isThai ? "Shop Name" : "ชื่อร้านค้า"}</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="name"
                        defaultValue={shop?.name}
                        placeholder="Enter shop name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-2">
                      <BootstrapForm.Label>{isThai ? "Shop Phone Number" : "เบอร์โทรและพร้อมเพย์ร้านค้า"}</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="tel"
                        name="phone_number"
                        defaultValue={shop?.phone_number}
                        placeholder="Enter your phone number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </BootstrapForm.Group>
                    <div className="d-flex justify-content-end align-items-center mt-4">
                      <Button type="submit" className="text-white" disabled={isLoading}>
                        {isLoading ? (isThai ? "Pending" : "กำลังดำเนินการ") : (isThai ? "Save" : "บันทึกการเปลี่ยนแปลง")}
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

export default ShopSetting;