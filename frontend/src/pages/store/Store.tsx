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
import { StoreNavbar } from "../../components/Navbar";
import { setIsThai } from "../../features/translation/translationSlice";

interface Data {
  shop_id: number;
  shouldDetectBarcode: boolean;
  file: string | null;
}

const Store: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [objectCameraDeviceId, setObjectCameraDeviceId] = useState('');
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalBody, setModalBody] = useState("success");
  const [devToolToggle, setDevToolToggle] = useState(0);

  const { inferenceResult, pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.inference
  );
  const isThai = useSelector((state: RootState) => state.translation.isThai);

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

  useEffect(() => {
    dispatch<any>(setIdle());
  }, []);

  useEffect(() => {
    if (pendingStatus == 'rejected') {
      setShouldShowModal(true);
      setModalStatus(false);
      setModalBody("Out of Stock");
    }
  }, [error])

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

  useEffect(() => {
    if (devToolToggle == 12) {
      navigate("/Store/Setup");
    }
  }, [devToolToggle])

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
    <>
      <Container className="align-items-center p-5 w-100 h-100">
        <div className="d-flex flex-row justify-content-center align-items-stretch h-100">
          <div className="d-flex flex-column justify-content-between pe-5 flex-grow-1">
            <div>
              <div className="d-flex align-items-center mb-3" style={{ cursor: 'pointer' }} onClick={() => dispatch<any>(setIsThai())}>
                <Image
                  src={isThai ?
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png" :
                    "https://cdn.britannica.com/38/4038-004-111388C2/Flag-Thailand.jpg"}
                  roundedCircle
                  style={{ width: "25px", height: "25px" }}
                  className="align-self-center me-2"
                />
                {isThai ? "EN" : "TH"}
              </div>
              <h1>{isThai ? "Welcome to Cashierless-Store" : "ยินดีต้อนรับเข้าสู่ร้านค้าไร้พนักงาน"}</h1>
              {isThai ? (
                <p style={{ color: "gray" }}>
                  Cashierless-store is a store for
                  <span onClick={() => setDevToolToggle(devToolToggle + 1)}> your </span>
                  convience store experiece
                </p>
              ) : (
                <p style={{ color: "gray" }}>
                  ร้านค้าไร้พนักงาน เป็นร้านค้ารูปแบบใหม่ ที่จะสร้างประสบการณ์ที่ยอดเยี่ยมให้แก่
                  <span onClick={() => setDevToolToggle(devToolToggle + 1)}>คุณ</span>
                </p>
              )}
            </div>
            <div className="fs-4 text-danger">{isThai ? "* Please place goods facing up to the camera."
              : "* กรุณาวางสินค้าให้ฉลากหงายขึ้นเข้าหากล้อง"}</div>
            <div>
              <h4 className="mt-5">{isThai ? "Place your item in the frame" : "กรุณาวางสินค้าให้อยู่ในกล้องด้านขวามือ"}</h4>
              <div className="mb-4 bg-primary border-bottom border-gray pb-1"></div>
              <div>
                <Button
                  className="text-white w-100"
                  style={{ height: "144px", fontSize: "32px", fontWeight: 800 }}
                  disabled={isLoading}
                  onClick={capture}
                >
                  {isLoading ? (isThai ? "Please wait" : "กำลังคำนวน") : (isThai ? "Checking Out" : "ยืนยัน")}
                </Button>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center bg-black rounded  align-items-stretch h-100 w-50">
            {objectCameraDeviceId && <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                deviceId: objectCameraDeviceId
              }}
            />}
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
    </>
  );
};

export default Store;
