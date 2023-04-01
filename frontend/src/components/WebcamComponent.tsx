import React, { useCallback, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

interface Data {
  shop_id: number;
  shouldDetectBarcode: boolean;
  file: string | null;
}

const WebcamComponent = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);

      const request: Data = {
        shop_id: 0,
        shouldDetectBarcode: false,
        file: imageSrc,
      };
      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(request),
        mode: "no-cors",
      };
      console.log(JSON.stringify(request));
      fetch("http://localhost:8000/imapi/v1/inference", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  }, [webcamRef]);

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <Button className="text-white" onClick={capture}>
        Capture photo
      </Button>
    </>
  );
};

export default WebcamComponent;
