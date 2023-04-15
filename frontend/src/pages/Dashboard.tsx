import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import CarouselWithItems from "../components/Carousel";
import * as Navbar from "../components/Navbar";
import Scanner from "../components/Scanner";
import "./Dashboard.scss";
import {
  BsUpcScan,
  BsFillCreditCardFill,
  BsClockHistory,
  BsPencilFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useDispatch } from "react-redux";
import { fetchWallet } from "../features/auth/authAPI";
import { fetchClientTransaction } from "../features/transaction/transactionAPI";
import TopupModal from "../components/TopupModal";

const Dashboard: React.FC = () => {
  const [showScan, setShowScan] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const handleCloseScan = () => setShowScan(false);
  const handleShowScan = () => setShowScan(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<any>(fetchWallet());
    dispatch<any>(fetchClientTransaction());
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.auth.user);
  const wallet = useSelector((state: RootState) => state.auth.wallet);
  const clientTransaction = useSelector(
    (state: RootState) => state.transaction.clientTransaction
  );

  const handleDateFormat = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedDate = date.toLocaleString();
    return formattedDate
  }

  return (
    <div>
      <Navbar.DashbaordNavbar />
      <Container>
        <Row className="d-flex flex-row justify-content-center align-items-stretch">
          <Col lg={6} className="p-4">
            <div className="mb-4">
              <h1 className="fw-bold">Good to see you!</h1>
              {/* <p className="mb-0">Click the button to see</p> */}
              <p className="mt-0" style={{ color: "gray" }}>
                What will you do today?
              </p>
              {/* <Button variant="primary" className="text-white w-25">
                Product
              </Button> */}
            </div>
            <Card>
              <Card.Body>
                <Row>
                  <Col
                    xs={8}
                    className="d-flex flex-column justify-content-between py-2"
                  >
                    <h3>Balance</h3>
                    <h1>{wallet?.balance} ฿</h1>
                    {/* <small>Your account number is 123-456-789</small> */}
                  </Col>
                  <Col xs={4}>
                    <Button
                      variant="primary"
                      className="text-white w-100 card-button"
                      onClick={handleShowScan}
                    >
                      <BsUpcScan className="me-1" />
                      <span>Scan</span>
                    </Button>
                    <Button
                      variant="primary"
                      className="text-white w-100 card-button"
                      onClick={() => setShowTopup(true)}
                    >
                      <BsFillCreditCardFill className="me-1" />
                      <span>Top Up</span>
                    </Button>
                    <Link to={"/Transaction"}>
                      <Button
                        variant="primary"
                        className="text-white w-100 card-button"
                      >
                        <BsClockHistory className="me-1" />
                        <span>Transaction</span>
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <CarouselWithItems
              items={[
                {
                  id: 1,
                  imgSrc:
                    "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg",
                  imgAlt: "nope",
                  label: "Something",
                  description: "Lorem Ipsum is Lorem Ipsum",
                },
              ]}
            />
          </Col>
          <Col lg={4} className="py-4">
            <Card className="h-100">
              <Card.Body>
                <CardGroup className="d-flex flex-column align-items-center mb-3 px-3">
                  <h4 className="mt-3 fw-bold">My Profile</h4>
                  <Image
                    className="profile-img border rounded-5 my-3"
                    rounded
                    src={user?.profile_image ? user.profile_image : "https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg"}
                  />
                  <h5 className="fw-bold mb-0">{user?.name}</h5>
                  <p>{user?.is_shop_owner ? "Shop Owner" : "Customer"}</p>
                  <div className="d-flex flex-row">
                    <Link to={"/Profile"}>
                      <Button variant="primary text-white">Edit Profile</Button>
                    </Link>
                  </div>
                  <div className="my-4 bg-primary border-bottom border-gray pb-1 mb-0 w-100" />
                </CardGroup>
                <CardGroup className="px-3">
                  <h5 className="fw-bold mb-3">Your last transaction</h5>
                  {clientTransaction.slice(0, 3).map((item) => (
                    <div className="w-100" key={item.id}>
                      <div className="d-flex justify-content-between">
                        <p className="mb-1">
                          {handleDateFormat(item.date) || "Unknown Date"}
                        </p>
                        <p>{item.total_items == 0 ? "Topup Service" : `${item.total_items} Items`}</p>
                      </div>
                      <div className="d-flex justify-content-between mt-0">
                        <Link to={`/transaction/${item.id}`}>View Detail</Link>
                        <p>{item.total_price + " ฿"}</p>
                      </div>
                      <hr className="mt-0 mb-4" />
                    </div>
                  ))}
                </CardGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showScan} onHide={handleCloseScan}>
        <Modal.Header closeButton>
          <Modal.Title>Scan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Scanner />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseScan}>
            Close
          </Button>
          <Button variant="primary text-white" onClick={handleCloseScan}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <TopupModal show={showTopup} onHide={() => setShowTopup(false)} />
    </div>
  );
};

export default Dashboard;
