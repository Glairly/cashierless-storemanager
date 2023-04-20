import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getShopByClientId } from "../features/auth/authAPI";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../app/store";
import { BsArrowUpCircle, BsCashCoin, BsCurrencyBitcoin } from "react-icons/bs";

const Stocking: React.FC = () => {
  const dispatch = useDispatch();

  const shop = useSelector((state: RootState) => state.auth.shop);

  useEffect(() => {
    dispatch<any>(getShopByClientId())
  }, [dispatch])

  return (
    <Container>
      <Row md={3} className="px-1 py-1">
        <Col className="mb-3">
          <Card className="rounded-4" style={{
            backgroundColor: "#0195ff", borderStyle: "none"
          }}>
            <div className="d-flex flex-row px-3">
              <div className="d-flex align-items-center me-2">
                <div className="d-flex rounded-circle p-3" style={{ backgroundColor: "#27a4ff" }}>
                  <BsCashCoin size={25} className="align-self-center text-white" />
                </div>
              </div>

              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="text-white">Shop Balance</span>
                  <span className="fs-2 fw-bold text-white">${shop?.wallet.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col className="mb-3">
          <Card className="rounded-4" style={{
            backgroundColor: "#01c283", borderStyle: "none"
          }}>
            <div className="d-flex flex-row px-3">
              <div className="d-flex align-items-center me-2">
                <div className="d-flex rounded-circle p-3" style={{ backgroundColor: "#26cb92" }}>
                  <BsCurrencyBitcoin size={25} className="align-self-center text-white" />
                </div>
              </div>

              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="text-white">Monthly Sale</span>
                  <span className="fs-2 fw-bold text-white">${(3453).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col className="mb-3">
          <Card className="rounded-4" style={{
            backgroundColor: "#884dff", borderStyle: "none"
          }}>
            <div className="d-flex flex-row px-3">
              <div className="d-flex align-items-center me-2">
                <div className="d-flex rounded-circle p-3" style={{ backgroundColor: "#9966ff" }}>
                  <BsArrowUpCircle size={25} className="align-self-center text-white" />
                </div>
              </div>

              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="text-white">Shop Balance</span>
                  <span className="fs-2 fw-bold text-white">${shop?.wallet.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Table border={1}>
        <thead style={{ backgroundColor: "#758096" }} className="text-white">
          <tr>
            <th className="fw-normal">Item Name</th>
            <th className="fw-normal text center">Type</th>
            <th className="fw-normal text-center">Count</th>
            <th className="fw-normal text-center">Price</th>
            <th className="fw-normal text-center">Delete</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </Table>
    </Container>
  );
}

export default Stocking;