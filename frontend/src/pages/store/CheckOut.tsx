import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image } from "react-bootstrap";
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

const CheckOut: React.FC = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const [data, setData] = useState<CheckOutProps>();

  const handlePayment = () => {
    setShouldShowModal(true)
  };

  const onRetry = () => {
    dispatch<any>(setInferenceResult(null));
    navigate("/Store");
  };

  useEffect(() => {
    setData(location.state);
  }, []);

  const { inferenceResult, pendingStatus, isLoading, error } = useSelector(
    (state: RootState) => state.inference
  );

  return (
    <Container className="align-items-center p-5 w-100 h-100">
      <Row className="h-100">
        <Col>
          <Image className="rounded" src={data?.base64} />
        </Col>
        <Col>
          <div className="d-flex flex-column h-100 justify-content-between pt-3">
            <div>
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
                      <span style={{ paddingRight: "1rem" }}>x{_item.quantity}</span>
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
                  x{inferenceResult?.totalItems} {inferenceResult?.totalPrice}B
                </span>
              </div>
              <div style={{ borderBottom: "solid" }} />
              <div className="d-flex justify-content-center mt-2">
                <Button
                  className="me-2 text-white w-50"
                  style={{ height: "144px", fontSize: "32px", fontWeight: 800 }}
                  onClick={onRetry}
                >
                  Retry
                </Button>
                <Button
                  className="me-2 text-white w-50"
                  variant="success"
                  style={{ height: "144px", fontSize: "32px", fontWeight: 800 }}
                  disabled={isLoading}
                  onClick={handlePayment}
                >
                  Pay
                </Button>
              </div>
            </div>
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
