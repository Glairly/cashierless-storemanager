import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import CarouselWithItems from "../../components/Carousel";
import * as Navbar from "../../components/Navbar";
import "./AdminDashboard.scss";
import {
  BsUpcScan,
  BsFillCreditCardFill,
  BsClockHistory,
  BsPencilFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface transaction {
  id: number;
  client: string;
  date: Date;
  viewDetailLink: string;
  price: number;
}
interface profile {
  id: number;
  name: string;
  role: "Customer" | "Store";
}

const mockTransaction: transaction[] = [
  {
    id: 1,
    client: "Cherpomm",
    date: new Date(),
    viewDetailLink: "/transaction/1",
    price: 120,
  },
  {
    id: 2,
    client: "Cherpomm",
    date: new Date(),
    viewDetailLink: "/transaction/2",
    price: 120,
  },
  {
    id: 3,
    client: "Cherpomm",
    date: new Date(),
    viewDetailLink: "/transaction/3",
    price: 120,
  },
];

const mockProfile: profile = {
  id: 123456789,
  name: "Hardware Store",
  role: "Store",
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar.DashbaordNavbar />
      <Container>
        <Row className="d-flex flex-row justify-content-center align-items-stretch">
          <Col lg={6} className="p-4">
            <div className="mb-4">
              <h1 className="fw-bold">Good to see you!</h1>
              <p className="mb-0">Click the button to check all</p>
              <p className="mt-0">your sales history</p>
              <Link to={"/Admin/SalesHistory"}>
                <Button variant="primary" className="text-white w-25">
                  Sales History
                </Button>
              </Link>
            </div>
            <Card>
              <Card.Body>
                <Row>
                  <Col
                    xs={8}
                    className="d-flex flex-column justify-content-between py-2"
                  >
                    <h3>Overall Sales</h3>
                    <h1>$ 2200.00</h1>
                    <small>Your account number is {mockProfile.id}</small>
                  </Col>
                  <Col
                    xs={4}
                    className="d-flex flex-column justify-content-center"
                  >
                    <Link to={"/Admin/Stocking"}>
                      <Button
                        variant="primary"
                        className="text-white w-100 card-button"
                      >
                        <BsFillCreditCardFill className="me-1" />
                        <span>Adjust Product</span>
                      </Button>
                    </Link>
                    <Link to={"/Transaction"}>
                      <Button
                        variant="primary"
                        className="text-white w-100 card-button"
                      >
                        <BsClockHistory className="me-1" />
                        <span>View All Client</span>
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
                  label: "Hellomotherfuckers",
                  description: "a;dsflkja;dflkja;dfklja;kldjf",
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
                    fluid
                    rounded
                    src="https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg"
                  />
                  <h5 className="fw-bold mb-0">{mockProfile.name}</h5>
                  <p>{mockProfile.role}</p>
                  <div className="d-flex flex-row">
                    <Button variant="primary text-white me-2">
                      <BsPencilFill />
                    </Button>
                    <Link to={"/Profile"}>
                      <Button variant="primary text-white">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                  <div className="my-4 bg-primary border-bottom border-gray pb-1 mb-0 w-100" />
                </CardGroup>
                <CardGroup className="px-3">
                  <h5 className="fw-bold mb-3">Your last sales</h5>
                  {mockTransaction.map((item) => (
                    <div className="w-100" key={item.id}>
                      <div className="d-flex justify-content-between">
                        <p className="mb-1">{item.client}</p>
                        <p className="mb-1">{item.date.toLocaleString()}</p>
                      </div>
                      <div className="d-flex justify-content-between mt-0">
                        <Link to={item.viewDetailLink}>View Detail</Link>
                        <p>{item.price + " B"}</p>
                      </div>
                    </div>
                  ))}
                </CardGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
