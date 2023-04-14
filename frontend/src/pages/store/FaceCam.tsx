import { Button, Col, Container, Row, Image } from "react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkingout,
  recognizeFace,
} from "../../features/inference/inferenceAPI";
import { RootState } from "../../app/store";
import Popup from "../../components/Popup";
import {
  setCustomerInfo,
  setIdle,
} from "../../features/inference/inferenceSlice";

const FaceCam: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalBody, setModalBody] = useState("success");

  const { customerInfo, pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.inference
  );

  useEffect(() => {
    dispatch<any>(setIdle());
    dispatch<any>(setCustomerInfo(null));
  }, []);

  useEffect(() => {
    if (error) {
      setShouldShowModal(true);
      setModalStatus(false);
      setModalBody("Not found any faces or error has occured please try again");
    }
  }, [error]);

  useEffect(() => {
    if (!customerInfo?.user) return;
    if (pendingStatus == "idle") return;

    if (customerInfo?.access_token) {
      setShouldShowModal(true);
      setModalStatus(true);
      setModalBody("Welcome " + customerInfo.user.name);

      setTimeout(() => {
        navigate("/store");
      }, 5000);
    }
  }, [customerInfo]);

  const capture = useCallback(async () => {
    if (isLoading) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      const file = imageSrc.split(",", 2)[1];
      dispatch<any>(recognizeFace(file));
    }
  }, [webcamRef]);

  return (
    <Container className="align-items-center p-5 w-100 h-100">
      <div className="d-flex flex-row justify-content-center align-items-stretch h-100">
        <div className="d-flex flex-column justify-content-between pe-5 flex-grow-1">
          <div>
            <h1>Signing In</h1>
            <p style={{ color: "gray" }}>
              By Signed In we can record purchase history to keep track of your
              spending
            </p>
          </div>
          <div>Should have a example here</div>
          <div>
            <h4 className="mt-5">Put your face in the frame</h4>
            <div className="mb-4 bg-primary border-bottom border-gray pb-1"></div>
            <div>
              <Row>
                <Col sm={8}>
                  <Button
                    className="text-white w-100"
                    style={{
                      height: "144px",
                      fontSize: "32px",
                      fontWeight: 800,
                    }}
                    disabled={isLoading}
                    onClick={capture}
                    variant="success"
                  >
                    {isLoading ? "Please wait" : "Login"}
                  </Button>
                </Col>

                <Col>
                  <Link to="/store">
                    <Button
                      className="text-white w-100"
                      style={{
                        height: "144px",
                        fontSize: "32px",
                        fontWeight: 800,
                      }}
                      variant="danger"
                    >
                      Skip
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center bg-black rounded  align-items-stretch h-100">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        </div>

        <Popup
          show={shouldShowModal}
          onHide={function (): void {
            setShouldShowModal(false);
            dispatch<any>(setIdle());
          }}
          title={"Result"}
          body={modalBody}
          status={modalStatus}
          footer={<div></div>}
          isCloseBtn={false}
        />
      </div>
    </Container>
  );
};

export default FaceCam;
