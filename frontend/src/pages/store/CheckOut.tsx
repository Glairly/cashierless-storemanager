import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Card } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckOutProps, Pay } from "./model";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Item,
  setInferenceResult,
} from "../../features/inference/inferenceSlice";
import { useDispatch } from "react-redux";
import QRCodePopup from "./QRCodePopup";
import { setIdle as setIIdle } from "../../features/inference/inferenceSlice";
import { setIdle as setTIdle } from "../../features/transaction/transactionSlice";

const CheckOut: React.FC = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const [data, setData] = useState<CheckOutProps>();

  const handlePayment = () => {
    setShouldShowModal(true);
  };

  const onRetry = () => {
    dispatch<any>(setInferenceResult(null));
    navigate("/Store");
  };

  useEffect(() => {
    setData(location.state);
    dispatch<any>(setIIdle());
    dispatch<any>(setTIdle());
  }, []);

  const {
    inferenceResult,
    customerInfo,
    captured_image,
    pendingStatus,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.inference);

  return (
    <Container className="align-items-center p-5 w-100 h-100">
      <Row className="h-100">
        <Col sm={6}>
          <Image
            className="rounded"
            src={captured_image || ""}
            style={{
              filter: "drop-shadow(0px 4px 16px rgba(102, 102, 102, 0.15))",
            }}
          />
        </Col>
        <Col sm={6}>
          <div className="d-flex flex-column h-100 justify-content-start">
            <Card
              className="mb-4"
              style={{
                filter: "drop-shadow(0px 4px 16px rgba(102, 102, 102, 0.15))",
              }}
            >
              <Card.Body>
                <h6 className="fw-bold">Customer Info</h6>
                <div style={{ borderBottom: "solid" }} className="mb-3" />
                <div className="d-flex flex-row w-100">
                  {customerInfo?.user ? (
                    <>
                      <Image
                        src={
                          customerInfo.user.profile_image ||
                          "https://randomuser.me/api/portraits/men/1.jpg"
                        }
                        className="rounded align-self-center"
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div className="border mx-2"></div>
                      <div className="flex-grow-1">
                        <p
                          className="mb-0"
                          style={{ fontSize: "16px", fontWeight: "bold" }}
                        >
                          {customerInfo.user.name}
                        </p>
                        <small className="mb-0" style={{ color: "gray" }}>
                          {customerInfo.user.phone_number || "no phone number"}
                        </small>
                        <p
                          className="mb-0" style={{ fontSize: "16px" }}
                        >
                          Balance: {customerInfo.wallet?.balance}
                        </p>
                      </div>
                      <Link to="/store/login" className="align-self-center h-100">
                        <Button className="text-white w-100 h-100" variant="danger">
                          Logout
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link to="/store/login" className="w-100">
                      <Button className="text-white w-100">Sign in</Button>
                    </Link>
                  )}
                </div>
              </Card.Body>
            </Card>

            <Card
              className="flex-grow-1"
              style={{
                filter: "drop-shadow(0px 4px 16px rgba(102, 102, 102, 0.15))",
              }}
            >
              <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1">
                  <h4 className="fw-bold">Products List</h4>
                  <div style={{ borderBottom: "solid" }} className="mb-3" />
                  {inferenceResult?.items.map((item) => {
                    const _item = item as Item;
                    return (
                      <div
                        className="d-flex flex-row justify-content-between my-2"
                        style={{ fontSize: "1.25rem" }}
                        key={_item.id}
                      >
                        <span>{_item.name}</span>
                        <span>
                          <span style={{ paddingRight: "1rem" }}>
                            x{_item.quantity}
                          </span>
                          {_item.price * _item.quantity}฿
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div
                    className="d-flex flex-row justify-content-between mt-3 mb-2"
                    style={{ fontSize: "1.55rem", fontWeight: "bold" }}
                  >
                    <span>Total</span>
                    <span>
                      x{inferenceResult?.totalItems}{" "}
                      {inferenceResult?.totalPrice}B
                    </span>
                  </div>
                  <div style={{ borderBottom: "solid" }} />
                  <div className="d-flex justify-content-center mt-2">
                    <Button
                      className="me-2 text-white w-50"
                      style={{
                        height: "144px",
                        fontSize: "32px",
                        fontWeight: 800,
                      }}
                      onClick={onRetry}
                    >
                      Retry
                    </Button>
                    <Button
                      className="me-2 text-white w-50"
                      variant="success"
                      style={{
                        height: "144px",
                        fontSize: "32px",
                        fontWeight: 800,
                      }}
                      disabled={isLoading}
                      onClick={handlePayment}
                    >
                      Pay
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
      <QRCodePopup
        show={shouldShowModal}
        onHide={() => {
          setShouldShowModal(false);
        }}
      />
    </Container>
  );
};

export default CheckOut;
