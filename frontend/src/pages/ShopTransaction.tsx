import React, { useEffect, useState } from "react";
import { Button, Container, Pagination, Row, Table } from "react-bootstrap";
import { BsFillCheckCircleFill, BsFillDashCircleFill, BsFillTrashFill } from "react-icons/bs";
import * as Navbar from "../components/Navbar";
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopTransaction, getAllShop } from "../features/transaction/transactionAPI";
import { ItemType } from "../features/supply/supplySlice";
import { getAllItemType } from "../features/supply/supplyApi";
import { Transaction } from "../features/transaction/transactionSlice";

interface TransactionProps {
  id: number;
  store: string;
  timestamp: Date;
  product: string;
  price: number;
  status: "Success" | "Failure" | "Pending";
}

interface shop {
  id: number;
  name: string;
}

const ShopTransaction: React.FC = () => {
  const [activePage, setActivePage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [itemType, setItemType] = useState<ItemType[]>();

  const [paginationItems, setPaginationItems] = useState([] as any[]);

  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState<Transaction[]>([])
  // const transactions = useSelector(
  //   (state: RootState) => state.transaction.clientTransaction
  // );

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const handleDateFormat = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedDate = date.toLocaleString();
    return formattedDate
  }

  const handleItemType = (item_id: number): string | undefined => {
    const obj = itemType?.find(key => key.id === item_id)
    return obj?.name;
  }

  useEffect(() => {
    dispatch<any>(fetchShopTransaction()).then((result: any) => setTransactions(result));
  }, [dispatch])


  useEffect(() => {
    const temp = [];
    for (
      let i = 1;
      i <= Math.ceil(transactions.length / transactionsPerPage);
      i++
    ) {
      temp.push(
        <Pagination.Item
          key={i}
          active={i === activePage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    dispatch<any>(getAllItemType()).then((result: any) => setItemType(result));
    setPaginationItems(temp);
  }, [transactions]);

  return (
    <Container className="my-3">
      <div className="d-flex flex-row justify-content-center">
        <Pagination className="">
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === paginationItems.length}
          />
          <Pagination.Last
            onClick={() => handlePageChange(paginationItems.length)}
          />
        </Pagination>
      </div>
      <Table border={1}>
        <thead style={{ backgroundColor: "#758096" }} className="text-white">
          <tr>
            <th className="fw-normal">Client Name</th>
            <th className="fw-normal text-center">Items</th>
            <th className="fw-normal text-center">Price</th>
            <th className="fw-normal text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length == 0 ? (
            <tr className="align-middle">
              <td>No transaction history</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr className="align-middle" key={transaction.id}>
                <td className="py-3 ps-3">
                  <div className="d-flex">
                    <div className="d-flex flex-column justify-content-center">
                      <span className="fw-bold">{transaction.client_name}</span>
                      <small style={{ color: "#758096" }}>Transaction ID: {transaction.id}</small>
                      <small style={{ color: "#758096" }}>{handleDateFormat(transaction.date) || "Unknown Date"}</small>
                    </div>
                  </div>
                </td>
                <td className="text-center">{transaction.transaction_items.length === 0 ? "-" :
                  transaction.transaction_items.map((x) => (
                    <>
                      {x.item_name || "Unknown Item"} x {x.quantity}
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
            ))
          )}


        </tbody>
      </Table>
    </Container>
  );
};

export default ShopTransaction;
