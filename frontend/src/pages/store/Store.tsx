import { Button, Col, Container, Row, Image } from "react-bootstrap";
import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

interface Data {
  shop_id: number;
  shouldDetectBarcode: boolean;
  file: string | null;
}

const Store: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  let navigate = useNavigate();

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      const request: Data = {
        shop_id: 3,
        shouldDetectBarcode: false,
        file: imageSrc.split(",", 2)[1],
      };

      try {
        const response = await fetch(
          "http://localhost:8000/imapi/v1/inference",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          }
        );
        const data = await response.json();
        console.log("Response:", data);
        navigate("CheckOut", {
          state: {
            base64: imageSrc,
            items: data.items,
            totalPrice: data.totalPrice,
            totalItems: data.totalItems,
          },
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }, [webcamRef]);

  return (
    <Container className="align-items-center p-5">
      <div className="d-flex flex-row justify-content-center align-items-centers">
        <div className="d-flex flex-column justify-content-center pe-5">
          <h1>Welcome to HW-Store</h1>
          <p>
            Hw-store is cashierless store for your convience store experiece
          </p>
          <p>Place your item in the frame</p>
          <div className="my-4 bg-primary border-bottom border-gray pb-1 w-50" />
          <div>
            <Button className="text-white w-10" onClick={capture}>
              Capture photo
            </Button>
          </div>
        </div>
        <Col className="d-flex flex-column justify-content-center">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        </Col>
      </div>
    </Container>
  );
};

export default Store;
