import { useEffect, useState } from "react";
import { Button, Card, Image, Table } from "react-bootstrap";
import { BsCurrencyDollar, BsFillCheckCircleFill, BsFillDashCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../features/auth/authAPI";
import { fetchClientTransaction, getAllShop } from "../features/transaction/transactionAPI";
import { RootState } from "../app/store";
import { getAllItemType } from "../features/supply/supplyApi";
import { ItemType } from "../features/supply/supplySlice";

interface shop {
  id: number;
  name: string;
}

const NewDashboard: React.FC = () => {
  const [shop, setShop] = useState<shop[]>();
  const [itemType, setItemType] = useState<ItemType[]>();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<any>(fetchWallet());
    dispatch<any>(fetchClientTransaction());
    dispatch<any>(getAllItemType()).then((result: any) => setItemType(result));
    dispatch<any>(getAllShop()).then((result: any) => setShop(result));
    // console.log(itemType);
  }, [dispatch]);

  const handleDateFormat = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedDate = date.toLocaleString();
    return formattedDate
  }

  const handleShopName = (shop_id: number): string | undefined => {
    const obj = shop?.find(key => key.id === shop_id)
    return obj?.name;
  }

  const handleItemType = (item_id: number): string | undefined => {
    const obj = itemType?.find(key => key.id === item_id)
    return obj?.name;
  }

  const wallet = useSelector((state: RootState) => state.auth.wallet);
  const clientTransaction = useSelector(
    (state: RootState) => state.transaction.clientTransaction
  );

  return (
    <div className="p-3 bg-light">
      <div className="container-fluid">
        <div className="row">
          <Card className="rounded-4 mb-3" style={{ backgroundColor: "#ffeacc", borderStyle: "none" }}>
            <Card.Body>
              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="fs-2 fw-bold" style={{ color: "#ff9600" }}>$ {wallet?.balance.toFixed(2)}</span>
                  <span style={{ color: "#ff9600" }}>Current Cashierless Wallet Ballance</span>
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <Button className="text-white" style={{ backgroundColor: "#ff9600", borderStyle: "none" }}>+ Add Money to Wallet</Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          <span className="fs-5 fw-bold ps-0 my-3">Transaction History</span>
          <Table border={1}>
            <thead style={{ backgroundColor: "#758096" }} className="text-white">
              <tr>
                <th className="fw-normal">Shop Name</th>
                <th className="fw-normal text-center">Items</th>
                <th className="fw-normal text-center">Price</th>
                <th className="fw-normal text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientTransaction.slice(0, 3).map((transaction) => (
                <tr className="align-middle" key={transaction.id}>
                  <td className="py-3 ps-3">
                    <div className="d-flex">
                      <div className="d-flex flex-column justify-content-center">
                        <span className="fw-bold">{handleShopName(transaction.shop_id) || "Unkown Shop"}</span>
                        <small style={{ color: "#758096" }}>Transaction ID: {transaction.id}</small>
                        <small style={{ color: "#758096" }}>{handleDateFormat(transaction.date) || "Unknown Date"}</small>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{transaction.transaction_items.length === 0 ? "-" :
                    transaction.transaction_items.map((x) => (
                      <>
                        {handleItemType(x.item_id) || "Unknow"} x {x.quantity}
                        <br />
                      </>
                    ))}</td>
                  <td className="text-center">{transaction.total_price}</td>
                  <td>
                    <div
                      className="d-flex flex-column align-items-center"
                      style={"Complete" === "Complete" ? { color: "#43db00" } : { color: "red" }}
                    >
                      {"Complete" === "Complete" ? <BsFillCheckCircleFill /> : <BsFillDashCircleFill />}
                      <small>{"Complete"}</small>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default NewDashboard;