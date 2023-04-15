import React, { useEffect, useState } from "react";
import { Button, Container, Pagination, Row, Table } from "react-bootstrap";
import { BsFillTrashFill } from "react-icons/bs";
import * as Navbar from "../components/Navbar";
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllShop } from "../features/transaction/transactionAPI";

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

const Transaction: React.FC = () => {
  const [activePage, setActivePage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [shop, setShop] = useState<shop[] | null>();

  const [paginationItems, setPaginationItems] = useState([] as any[]);

  const dispatch = useDispatch();

  const transactions = useSelector(
    (state: RootState) => state.transaction.clientTransaction
  );

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const handleDateFormat = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedDate = date.toLocaleString();
    return formattedDate
  }

  const handleShopName = (shop_id: number): shop | undefined => {
    const obj = shop?.find(key => key.id === shop_id)
    return obj;
  }

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
    dispatch<any>(getAllShop()).then((result: any) => setShop(result));
    setPaginationItems(temp);
  }, [transactions]);

  return (
    <div>
      <Navbar.DashbaordNavbar />
      <Container className="my-3">
        <div className="d-flex flex-row">
          <h2 className="fw-bold">Transaction History</h2>
          <Pagination className="ms-auto">
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
        <Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Store</th>
              <th>Timestamp</th>
              <th>Product</th>
              <th>Price</th>
              <th>Total items</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="text-center align-middle">
                <td>{transaction.id}</td>
                <td>{handleShopName(transaction.shop_id)?.name}</td>
                <td>{handleDateFormat(transaction?.date) || "Unknown date"}</td>
                <td>
                  {transaction.transaction_items.length === 0 ? "-" :
                    transaction.transaction_items.map((x) => (
                      <>
                        {x.item_id} x {x.quantity}
                        <br />
                      </>
                    ))}
                </td>
                <td>{transaction.total_price + " ฿"}</td>
                <td>{transaction.total_items == 0 ? "-" : transaction.total_items}</td>
                <td>
                  <Button className="text-white">
                    <BsFillTrashFill />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Transaction;
