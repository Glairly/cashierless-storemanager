import { Button, Col, Container, Row, Image } from "react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkingout } from "../../features/inference/inferenceAPI";
import { RootState } from "../../app/store";
import Popup from "../../components/Popup";
import {
  setCaptureImage,
  setIdle,
  setInferenceResult,
} from "../../features/inference/inferenceSlice";

interface Data {
  shop_id: number;
  shouldDetectBarcode: boolean;
  file: string | null;
}

const Store: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalBody, setModalBody] = useState("success");

  const { inferenceResult, pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.inference
  );

  useEffect(() => {
    dispatch<any>(setIdle());
  }, []);

  useEffect(() => {
    if (!inferenceResult) return;

    if (!inferenceResult?.items.length) {
      setShouldShowModal(true);
      setModalStatus(false);
      setModalBody("Item not found Please try again");
    } else {
      navigate("/Store/Checkout", {
        state: {
          base64: imgSrc,
        },
      });
    }
  }, [inferenceResult]);

  const capture = useCallback(async () => {
    if (isLoading) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      const file = imageSrc.split(",", 2)[1];
      dispatch<any>(setCaptureImage(imageSrc));
      dispatch<any>(checkingout(file));
    }
  }, [webcamRef]);

  return (
    <Container className="align-items-center p-5 w-100 h-100">
      <div className="d-flex flex-row justify-content-center align-items-stretch h-100">
        <div className="d-flex flex-column justify-content-between pe-5 flex-grow-1">
          <div>
            <h1>Welcome to HW-Store</h1>
            <p style={{ color: "gray" }}>
              HW-store is cashierless store for your convience store experiece
            </p>
          </div>
          <div>Should have a example here</div>
          <div>
            <h4 className="mt-5">Place your item in the frame</h4>
            <div className="mb-4 bg-primary border-bottom border-gray pb-1"></div>
            <div>
              <Button
                className="text-white w-100"
                style={{ height: "144px", fontSize: "32px", fontWeight: 800 }}
                disabled={isLoading}
                onClick={capture}
              >
                {isLoading ? "Please wait" : "Checking Out"}
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center bg-black rounded  align-items-stretch h-100 w-50">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
        </div>

        <Popup
          show={shouldShowModal}
          onHide={function (): void {
            setShouldShowModal(false);
            dispatch<any>(setInferenceResult(null));
          }}
          title={"Result"}
          body={modalBody}
          status={modalStatus}
        />
      </div>
    </Container>
  );
};

export default Store;
