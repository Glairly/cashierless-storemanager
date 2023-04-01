import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckOutProps, Pay } from "./model";

const CheckOut: React.FC = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const [data, setData] = useState<CheckOutProps>();
  const [temp, setTemp] = useState<Pay[]>([]);

  const itemToPay = () => {
    data?.items.forEach((item) => {});
  };

  const handlePayment = () => {
    let payment: Pay[] = [];
    data?.items.forEach((item) => {
      payment.push({ item_id: item.id, quantity: 1 });
    });
    console.log(payment);
    navigate("/Store/Payment", {
      state: {
        client_id: 6,
        shop_id: 3,
        items: payment,
        barcodes: [],
      },
    });
  };

  useEffect(() => {
    setData(location.state);
  }, []);
  return (
    <div>
      <Container className="p-5 h-100">
        <Row>
          <Col>
            <Image src={data?.base64} />
          </Col>
          <Col>
            <div className="d-flex flex-column h-100 justify-content-between py-3">
              <div>
                <h4 className="fw-bold">Summary</h4>
                <div style={{ borderBottom: "solid" }} />
                {data?.items.map((item) => (
                  <div
                    className="d-flex flex-row justify-content-between my-2"
                    key={item.id}
                  >
                    <span>{item.name}</span>
                    <span>
                      x{1} {item.price}B
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="d-flex flex-row justify-content-between mt-3 mb-2">
                  <span>Total</span>
                  <span>
                    x{data?.totalItems} {data?.totalPrice}B
                  </span>
                </div>
                <div style={{ borderBottom: "solid" }} />
                <div className="d-flex justify-content-center mt-2">
                  <Button className="me-2 text-white" onClick={handlePayment}>
                    Pay
                  </Button>
                  <Link to={"/Store"}>
                    <Button className="text-white">Retry</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckOut;
