import React, { useState } from "react";
import { Button, Container, Pagination, Row, Table } from "react-bootstrap";
import { BsFillTrashFill } from "react-icons/bs";
import * as Navbar from "../components/Navbar";

interface TransactionProps {
  id: number;
  store: string;
  timestamp: Date;
  product: string;
  price: number;
  status: "Success" | "Failure" | "Pending";
}

const Transaction: React.FC = () => {
  const mockTransactions: TransactionProps[] = [
    {
      id: 1,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 2,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 3,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 4,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 5,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 6,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 7,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 8,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 9,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 10,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 11,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 12,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 13,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
    {
      id: 14,
      store: "Hardware Store",
      timestamp: new Date(),
      product: "Lay Origianl x 1",
      price: 20,
      status: "Success",
    },
  ];

  const [activePage, setActivePage] = useState(1);
  const [transactionsPerPage] = useState(10);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const indexOfLastTransaction = activePage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = mockTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginationItems = [];
  for (
    let i = 1;
    i <= Math.ceil(mockTransactions.length / transactionsPerPage);
    i++
  ) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === activePage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

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
              <th>Transaction Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="text-center">
                <td>{transaction.id}</td>
                <td>{transaction.store}</td>
                <td>{transaction.timestamp.toLocaleString()}</td>
                <td>{transaction.product}</td>
                <td>{transaction.price + " B"}</td>
                <td>{transaction.status}</td>
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
