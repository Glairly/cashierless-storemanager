import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getShopByClientId } from "../features/auth/authAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../app/store";
import { BsArrowUpCircle, BsCashCoin, BsCurrencyBitcoin, BsPlusCircleFill } from "react-icons/bs";
import { getAllItemType, getItemByShopId } from "../features/supply/supplyApi";
import { Item, ItemType, setItem } from "../features/supply/supplySlice";

const Stocking: React.FC = () => {
  const dispatch = useDispatch();
  const [isStockChange, setIsStockChange] = useState(false);

  const items = useSelector((state: RootState) => state.supply.item);
  const shop = useSelector((state: RootState) => state.auth.shop);
  const itemTypes = useSelector((state: RootState) => state.supply.itemType);

  const handleItemType = (item_id: number): string | undefined => {
    const obj = itemTypes?.find(key => key.id === item_id)
    return obj?.name;
  }

  useEffect(() => {
    dispatch<any>(getShopByClientId());
    dispatch<any>(getItemByShopId());
    dispatch<any>(getAllItemType());
  }, [dispatch])

  return (
    <Container className="mt-3">
      <Row lg={3} className="px-1 py-1 ">
        <Col>
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
        <Col>
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
        <Col>
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
                  <span className="text-white">Monthly Profit</span>
                  <span className="fs-2 fw-bold text-white">${shop?.wallet.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-between py-3">
          <span className="fs-5 fw-bold">Manage Panel</span>
          <Button className="text-white" disabled={!isStockChange}>Save you stock</Button>
        </Col>
      </Row>
      <Table border={1}>
        <thead style={{ backgroundColor: "#758096" }} className="text-white">
          <tr>
            <th className="fw-normal">Item Name</th>
            <th className="fw-normal">Type</th>
            <th className="fw-normal text-center">Count</th>
            <th className="fw-normal text-center">Price</th>
            <th className="fw-normal text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {items && items.map((item) => (
            <tr className="align-middle" key={item.id}>
              <td>
                <div className="d-flex flex-column">
                  <span className="fw-bold">{item.name}</span>
                  <small style={{ color: "#758096" }} >Item Id: {item.id}</small>
                </div>
              </td>
              <td>{handleItemType(parseInt(item.type))}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <Button className="rounded-circle me-1">-</Button>
                  <BsPlusCircleFill color={"lime"} />
                  {item.price}
                  <Button className="rounded-circle ms-1">+</Button>
                </div>
              </td>
              <td className="text-center">-</td>
            </tr>
          ))}
          <tr className="align-middle">
            <td>No transaction history</td>
            <td className="text-center">-</td>
            <td className="text-center">-</td>
            <td className="text-center">-</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default Stocking;