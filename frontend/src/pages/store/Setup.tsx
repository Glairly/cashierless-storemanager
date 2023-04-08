import {
  Button,
  Col,
  Container,
  Row,
  Form as BForm,
  FormCheck,
  Image,
  Card,
} from "react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkingout } from "../../features/inference/inferenceAPI";
import { RootState } from "../../app/store";
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";
import {
  setBarcodeEnabled,
  setMachineId,
  setShopId,
} from "../../features/inference/inferenceSlice";
import Popup from "../../components/Popup";

const Setup: React.FC = () => {
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);

  const [initialValues, setInitialValues] = useState({
    shop_id: 0,
    shouldDetectBarcode: false,
    machine_id: 0,
  });

  const validationSchema = Yup.object({
    shop_id: Yup.number().required("Required"),
    machine_id: Yup.number().required("Required"),
  });

  const inference = useSelector((state: RootState) => state.inference);

  useEffect(() => {
    setInitialValues({
      shop_id: inference.shop_id || 0,
      shouldDetectBarcode: inference.is_barcode_enabled,
      machine_id: inference.machine_id || 0,
    });
  }, [inference]);

  const handleSubmit = async (values: any) => {
    const { shop_id, shouldDetectBarcode, machine_id } = values;
    dispatch<any>(setShopId(shop_id));
    dispatch<any>(setBarcodeEnabled(shouldDetectBarcode));
    dispatch<any>(setMachineId(machine_id));
    setShouldShowModal(true);
  };

  return (
    <Container
      className="align-items-center p-5 w-100"
      style={{ height: "fit-content" }}
    >
      <p
        className="w-100 text-center"
        style={{ fontSize: "2em", textTransform: "uppercase", fontWeight: 600 }}
      >
        🛒 Cashierless Store
      </p>
      <Card className="my-4">
        <Card.Header>
          <h4 className="mb-0">Machine Configuration</h4>
        </Card.Header>

        <Card.Body>
          <Card.Subtitle style={{ color: "gray" }}>
            to start using our machine we need a little information
          </Card.Subtitle>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form className="mt-4">
                <BForm.Group className="mb-3">
                  <BForm.Label>Machine Id</BForm.Label>
                  <BForm.Control
                    type="number"
                    name="machine_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="machine_id">
                    {(msg) => <small style={{ color: "red" }}>{msg}</small>}
                  </ErrorMessage>
                </BForm.Group>

                <BForm.Group className="mb-3">
                  <BForm.Label>Shop Id</BForm.Label>
                  <BForm.Control
                    type="number"
                    name="shop_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="shop_id">
                    {(msg) => <small style={{ color: "red" }}>{msg}</small>}
                  </ErrorMessage>
                </BForm.Group>

                <BForm.Group controlId="shouldDetectBarcode" className="mb-3">
                  <BForm.Label>Enable Barcode Scanning</BForm.Label>
                  <Field name="shouldDetectBarcode">
                    {({ field }: { field: any }) => (
                      <FormCheck
                        type="switch"
                        label={
                          values.shouldDetectBarcode ? "Enabled" : "Disabled"
                        }
                        checked={values.shouldDetectBarcode}
                        onChange={handleChange}
                        {...field}
                      />
                    )}
                  </Field>
                </BForm.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="text-white w-100"
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>

        {inference?.shop_id && inference?.machine_id ? (
          <Card.Footer
            style={{ padding: "2rem 2rem" }}
            className="d-flex justify-content-center bg-white"
          >
            <Link to="/Store">
              <Button
                type="submit"
                variant="success"
                className="text-white"
                disabled={
                  inference?.shop_id && inference?.machine_id ? false : true
                }
                style={{ width: "fit-content", fontSize: "4rem" }}
              >
                Proceed
              </Button>
            </Link>
          </Card.Footer>
        ) : (
          ""
        )}
      </Card>

      <Popup
        show={shouldShowModal}
        onHide={function (): void {
          setShouldShowModal(false);
        }}
        title={"Result"}
        body={"Set Machine Information Completed!"}
        status={true}
      />
    </Container>
  );
};

export default Setup;
