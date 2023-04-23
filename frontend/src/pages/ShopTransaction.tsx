import React, { useEffect, useState } from "react";
import { Container, Pagination, Table } from "react-bootstrap";
import { BsFillCheckCircleFill, BsFillDashCircleFill, BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { fetchShopTransaction } from "../features/transaction/transactionAPI";
import { Transaction as TransactionSlice } from "../features/transaction/transactionSlice";

const ShopTransaction: React.FC = () => {

  const dispatch = useDispatch();

  const [activePage, setActivePage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [paginationItems, setPaginationItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<TransactionSlice[] | null>(null);

  const indexOfLastTransaction = activePage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions?.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const [totalPage, setTotalPage] = useState<number>(0);

  const handleDateFormat = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedDate = date.toLocaleString();
    return formattedDate
  }

  useEffect(() => {
    const temp: any = [];
    let totalPages = 0;
    if (transactions) {
      totalPages = Math.ceil(transactions.length / transactionsPerPage);
    }
    setTotalPage(totalPages)
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        temp.push(
          <Pagination.Item key={i} active={i === activePage} onClick={() => setActivePage(i)}>
            {i}
          </Pagination.Item>
        );
      }
    } else {
      if (activePage <= 2) {
        for (let i = 1; i <= 3; i++) {
          temp.push(
            <Pagination.Item key={i} active={i === activePage} onClick={() => setActivePage(i)}>
              {i}
            </Pagination.Item>
          );
        }
        temp.push(<Pagination.Ellipsis key="ellipsis1" />);
        temp.push(
          <Pagination.Item key={totalPages} active={totalPages === activePage} onClick={() => setActivePage(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      } else if (activePage >= totalPages - 1) {
        temp.push(
          <Pagination.Item key={1} active={1 === activePage} onClick={() => setActivePage(1)}>
            {1}
          </Pagination.Item>
        );
        temp.push(<Pagination.Ellipsis key="ellipsis2" />);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          temp.push(
            <Pagination.Item key={i} active={i === activePage} onClick={() => setActivePage(i)}>
              {i}
            </Pagination.Item>
          );
        }
      } else {
        temp.push(
          <Pagination.Item key={1} active={1 === activePage} onClick={() => setActivePage(1)}>
            {1}
          </Pagination.Item>
        );
        temp.push(<Pagination.Ellipsis key="ellipsis3" />);
        for (let i = activePage - 1; i <= activePage + 1; i++) {
          temp.push(
            <Pagination.Item key={i} active={i === activePage} onClick={() => setActivePage(i)}>
              {i}
            </Pagination.Item>
          );
        }
        temp.push(<Pagination.Ellipsis key="ellipsis4" />);
        temp.push(
          <Pagination.Item key={totalPages} active={totalPages === activePage} onClick={() => setActivePage(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      }
    }
    setPaginationItems(temp);
  }, [activePage, transactions]);

  useEffect(() => {
    dispatch<any>(fetchShopTransaction()).then((result: any) => setTransactions(result));
  }, [dispatch])

  return (
    <Container className="my-3">
      <div className="d-flex flex-row justify-content-center">
        <Pagination className="ms-auto">
          <Pagination.First onClick={() => setActivePage(1)} />
          <Pagination.Prev
            onClick={() => setActivePage(activePage - 1)}
            disabled={activePage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => setActivePage(activePage + 1)}
            disabled={activePage === totalPage}
          />
          <Pagination.Last
            onClick={() => setActivePage(totalPage)}
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
          {transactions && (transactions.length == 0 ? (
            <tr className="align-middle">
              <td>No transaction history</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
            </tr>
          ) : (
            currentTransactions?.map((transaction) => (
              <tr className="align-middle" key={transaction.id}>
                <td className="py-3 ps-3">
                  <div className="d-flex">
                    <div className="d-flex flex-column justify-content-center">
                      <span className="fw-bold">{transaction.client_name || "Unkown Shop"}</span>
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
          ))}
          {!transactions &&
            <tr className="align-middle">
              <td>Loading transaction history</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
            </tr>
          }
        </tbody>
      </Table>
    </Container>
  );
};

export default ShopTransaction;
