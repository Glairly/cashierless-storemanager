import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";


interface Data {
  shop_id: number;
  shouldDetectBarcode: boolean;
  file: string | null;
}

const WebcamComponent = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [faceCameraDeviceId, setFaceCameraDeviceId] = useState('');
  const [objectCameraDeviceId, setObjectCameraDeviceId] = useState('');

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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(device => device.kind === 'videoinput');
        const cameraIds = cameras.map(camera => camera.deviceId);
        setObjectCameraDeviceId(cameraIds[1]);
      }).catch(error => {
        console.error(error);
      });
  }, [])

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ deviceId: objectCameraDeviceId }} />
      <Button className="text-white" onClick={capture}>
        Capture photo
      </Button>
    </>
  );
};

export default WebcamComponent;
