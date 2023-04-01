import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import * as Navbar from "../../components/Navbar";
import StockCard from "../../components/StockCard";
import "./Stocking.scss";

interface stock {
  id: number;
  name: string;
  price: number;
  description: string;
  count: number;
  picture: string;
}

const mockStock: stock[] = [
  {
    id: 1,
    name: "Lay Original",
    price: 20,
    description: "Helloworld",
    count: 10,
    picture:
      "https://backend.tops.co.th/media/catalog/product/8/8/8850718809028_05-04-2021.jpg",
  },
  {
    id: 2,
    name: "Lay Original",
    price: 20,
    description: "Helloworld",
    count: 10,
    picture:
      "https://backend.tops.co.th/media/catalog/product/8/8/8850718809028_05-04-2021.jpg",
  },
  {
    id: 3,
    name: "Lay Original",
    price: 20,
    description: "Helloworld",
    count: 10,
    picture:
      "https://backend.tops.co.th/media/catalog/product/8/8/8850718809028_05-04-2021.jpg",
  },
  {
    id: 4,
    name: "Lay Original",
    price: 20,
    description: "Helloworld",
    count: 10,
    picture:
      "https://backend.tops.co.th/media/catalog/product/8/8/8850718809028_05-04-2021.jpg",
  },
  {
    id: 5,
    name: "Lay Original",
    price: 20,
    description: "Helloworld",
    count: 10,
    picture:
      "https://backend.tops.co.th/media/catalog/product/8/8/8850718809028_05-04-2021.jpg",
  },
];

const Stocking: React.FC = () => {
  const [stocking, setStocking] = useState(mockStock);
  const handleSave = (data: stock) => {
    setStocking(mockStock);
  };

  useEffect(() => {
    console.log(stocking);
  }, [stocking]);

  return (
    <div>
      <Navbar.DashbaordNavbar />
      <Container className="my-3">
        <div className="d-flex flex-row">
          <h2 className="fw-bold">Stocking</h2>
        </div>
        <div className="d-flex flex-row">
          <Row>
            <Col md={9}>
              <Row>
                {stocking.map((item) => (
                  <StockCard
                    key={item.id}
                    item={item}
                    handleChange={handleSave}
                  />
                ))}
                <Card
                  style={{
                    width: "200px",
                    margin: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  }}
                >
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Button className="rounded-circle text-white mb-2">
                      +
                    </Button>
                    <span className="text-center">Add your product here</span>
                  </Card.Body>
                </Card>
              </Row>
            </Col>
            <Col md={3}>
              <div className="d-fix">
                <h4 className="fw-bold">Summary</h4>
                <div style={{ borderBottom: "solid" }} />
                {mockStock.map((item) => (
                  <div
                    className="d-flex flex-row justify-content-between my-2"
                    key={item.id}
                  >
                    <span>{item.name}</span>
                    <span>
                      x{item.count} {item.count * item.price}B
                    </span>
                  </div>
                ))}
                <div className="d-flex flex-row justify-content-between mt-3 mb-2">
                  <span>Total</span>
                  <span>x{mockStock.reduce((a, b) => a + b.count, 0)}</span>
                </div>
                <div style={{ borderBottom: "solid" }} />
                <div className="d-flex justify-content-end mt-2">
                  <Button className="me-2 text-white">Save</Button>
                  <Button className="text-white">Cancel</Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Stocking;
