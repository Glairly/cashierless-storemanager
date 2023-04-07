import { Button, Col, Container, Row, Image } from "react-bootstrap";
import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkingout } from "../../features/inference/inferenceAPI";
import { RootState } from "../../app/store";

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

  const inferenceResult = useSelector(
    (state: RootState) => state.inference.inferenceResult
  );

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      // const request: Data = {
      //   shop_id: 3,
      //   shouldDetectBarcode: false,
      //   file: imageSrc.split(",", 2)[1],
      // };
      const file = imageSrc.split(",", 2)[1];
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
              Hw-store is cashierless store for your convience store experiece
            </p>
          </div>
          {JSON.stringify(inferenceResult)}
          <div>
            <h4 className="mt-5">Place your item in the frame</h4>
            <div className="mb-4 bg-primary border-bottom border-gray pb-1" />
            <div>
              <Button
                className="text-white w-100"
                style={{ height: "144px", fontSize: "32px", fontWeight: 800 }}
                onClick={capture}
              >
                Checking Out
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center bg-black rounded  align-items-stretch h-100">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        </div>
      </div>
    </Container>
  );
};

export default Store;
