import React, { useEffect, useState } from "react";
import { Container, Pagination, Table } from "react-bootstrap";
import { BsFillCheckCircleFill, BsFillDashCircleFill, BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { fetchShopTransaction } from "../features/transaction/transactionAPI";
import { Transaction as TransactionSlice } from "../features/transaction/transactionSlice";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";

const ShopTransaction: React.FC = () => {

  const dispatch = useDispatch();

  const isThai = useAppSelector((state: RootState) => state.translation.isThai);

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
        <span className="fs-4 fw-bold">{isThai ? "Transaction" : "ประวัติการซื้อขาย"}</span>
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
            <th className="fw-normal">{isThai ? "Client Name" : "ชื่อผู้ใช้"}</th>
            <th className="fw-normal text-center">{isThai ? "Items" : "สินค้า"}</th>
            <th className="fw-normal text-center">{isThai ? "Price" : "ราคา"}</th>
            <th className="fw-normal text-center">{isThai ? "Status" : "สถานะชำระ"}</th>
          </tr>
        </thead>
        <tbody>
          {transactions && (transactions.length == 0 ? (
            <tr className="align-middle">
              <td>{isThai ? "No transaction history" : "ไม่มีประวัติการซื้อขาย"}</td>
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
                      <small style={{ color: "#758096" }}>{isThai ? "Transaction ID: " : "ไม่มีประวิติการซื้อขาย"} {transaction.id}</small>
                      <small style={{ color: "#758096" }}>{handleDateFormat(transaction.date) || (isThai ? "Unknown Date" : "ไม่ทราบวันที่ซื้อ")}</small>
                    </div>
                  </div>
                </td>
                <td className="text-center">{transaction.transaction_items.length === 0 ? "-" :
                  transaction.transaction_items.map((x) => (
                    <>
                      {x.item_name || (isThai ? "Unknown Item" : "ไม่ทราบวันชนิดสินค้า")} x {x.quantity}
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
                    <small>{isThai ? "Complete" : "ชำระสำเร็จ"}</small>
                  </div>
                </td>
              </tr>
            ))
          ))}
          {!transactions &&
            <tr className="align-middle">
              <td>{isThai ? "Loading transaction history" : "กำลังโหลดประวัติการขาย"}</td>
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
