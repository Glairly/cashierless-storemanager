import { Button, Card, Image, Table } from "react-bootstrap";
import { BsCurrencyDollar, BsFillCheckCircleFill, BsFillDashCircleFill } from "react-icons/bs";

const mock = [
  {
    id: 12345,
    shop_name: "Topup Service",
    shop_profile: "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg",
    date: "04 Apr, 2020 03:47pm",
    items: "Oishi yellow x 1",
    price: 100,
    status: "Complete"
  },
  {
    id: 14523,
    shop_name: "Topup Service",
    shop_profile: "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg",
    date: "04 Apr, 2020 03:47pm",
    items: "Oishi yellow x 1",
    price: 100,
    status: "Complete"
  },
  {
    id: 86567,
    shop_name: "Topup Service",
    shop_profile: "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg",
    date: "04 Apr, 2020 03:47pm",
    items: "Oishi yellow x 1",
    price: 100,
    status: "Failed"
  }
]

const NewDashboard: React.FC = () => {
  return (
    <div className="p-3 bg-light">
      <div className="container-fluid">
        <div className="row">
          <Card className="rounded-4 mb-3" style={{ backgroundColor: "#ffeacc", borderStyle: "none" }}>
            <Card.Body>
              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="fs-2 fw-bold" style={{ color: "#ff9600" }}>$ 1550.56</span>
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
              {mock.map((transaction) => (
                <tr className="align-middle" key={transaction.id}>
                  <td className="py-3 ps-2">
                    <div className="d-flex">
                      <Image
                        roundedCircle
                        style={{ width: "50px", height: "50px" }}
                        src={transaction.shop_profile}
                        className="align-self-center me-2"
                      />
                      <div className="d-flex flex-column justify-content-center">
                        <span className="fw-bold">{transaction.shop_name}</span>
                        <small>Transaction ID: {transaction.id}</small>
                        <small>{transaction.date}</small>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{transaction.items}</td>
                  <td className="text-center">{transaction.price}</td>
                  <td>
                    <div
                      className="d-flex flex-column align-items-center"
                      style={transaction.status === "Complete" ? { color: "#43db00" } : { color: "red" }}
                    >
                      {transaction.status === "Complete" ? <BsFillCheckCircleFill /> : <BsFillDashCircleFill />}
                      <small>{transaction.status}</small>
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