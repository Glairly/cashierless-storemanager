import { useEffect, useState } from "react";
import { Button, Card, Image, Table } from "react-bootstrap";
import { BsCurrencyDollar, BsFillCheckCircleFill, BsFillDashCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet, getShopByClientId } from "../features/auth/authAPI";
import { fetchClientTransaction, getAllShop } from "../features/transaction/transactionAPI";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../features/transaction/transactionSlice";

interface shop {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [clientTransaction, setClientTransaction] = useState<Transaction[] | null>(null);

  useEffect(() => {
    dispatch<any>(fetchWallet());
    dispatch<any>(fetchClientTransaction()).then((result: any) => setClientTransaction(result));
    dispatch<any>(getShopByClientId());
  }, [dispatch]);

  const handleDateFormat = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedDate = date.toLocaleString();
    return formattedDate
  }

  const setTopup = () => {
    navigate("/Topup");
  }

  const wallet = useSelector((state: RootState) => state.auth.wallet);

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
                  <Button
                    className="text-white"
                    style={{ backgroundColor: "#ff9600", borderStyle: "none" }}
                    onClick={setTopup}
                  >
                    + Add Money to Wallet
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          <span className="fs-5 fw-bold py-3 ps-0">Transaction History</span>
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
              {clientTransaction && (clientTransaction.length == 0 ? (
                <tr className="align-middle">
                  <td>No transaction history</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                </tr>
              ) : clientTransaction.slice(0, 3).map((transaction) => (
                <tr className="align-middle" key={transaction.id}>
                  <td className="py-3 ps-3">
                    <div className="d-flex">
                      <div className="d-flex flex-column justify-content-center">
                        <span className="fw-bold">{transaction.shop_name}</span>
                        <small style={{ color: "#758096" }}>Transaction ID: {transaction.id}</small>
                        <small style={{ color: "#758096" }}>{handleDateFormat(transaction.date) || "Unknown Date"}</small>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{transaction.transaction_items.length === 0 ? "-" :
                    transaction.transaction_items.map((x) => (
                      <>
                        {x.item_name} x {x.quantity}
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
              )))}
              {!clientTransaction &&
                <tr className="align-middle">
                  <td>Loading transaction history</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                </tr>
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;