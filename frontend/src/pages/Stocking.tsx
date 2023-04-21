import { Button, Card, Col, Container, Dropdown, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../app/store";
import { BsArrowUpCircle, BsCashCoin, BsCurrencyBitcoin, BsFillDashCircleFill, BsFillXSquareFill, BsPlusCircleFill, BsTrashFill } from "react-icons/bs";
import { editItem, getAllItemType, getItemByShopId } from "../features/supply/supplyApi";
import { Item } from "../features/inference/inferenceSlice";
import { Formik } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required(),
  quantity: Yup.number().required(),
  price: Yup.number().required(),
  type: Yup.number().required()
});

const initialValue = {
  name: "",
  quantity: 0,
  price: 0,
  type: ""
}

const Stocking: React.FC = () => {
  const dispatch = useDispatch();

  const items = useSelector((state: RootState) => state.supply.item);
  const shop = useSelector((state: RootState) => state.auth.shop);
  const itemTypes = useSelector((state: RootState) => state.supply.itemType);

  const [isStockChange, setIsStockChange] = useState(false);
  const [isEditStock, setIsEditStock] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [stock, setStock] = useState<Item[]>([]);
  const [requestStock, setRequestStock] = useState<Item[]>([]);
  const [selectedOption, setSelectedOption] = useState("");

  const handleItemType = (item_id: number): string | undefined => {
    const obj = itemTypes?.find(key => key.id === item_id)
    return obj?.name;
  }

  const handleStockCountIncrease = (id: number) => {
    setIsStockChange(true);
    const updatedCount = stock?.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setStock(updatedCount || null);
  }
  const handleStockCountDecrease = (id: number) => {
    setIsStockChange(true);
    const updatedCount = stock?.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setStock(updatedCount || null);
  }

  const handleCountSpan = (id: number) => {
    setIsStockChange(true);
    const count = prompt('Enter count:');
    if (count) {
      const updatedCount = stock?.map(item => {
        if (item.id === id) {
          return { ...item, quantity: parseInt(count) };
        }
        return item;
      });
      setStock(updatedCount || null)
    }
  };

  const handleDelete = (id: number) => {
    setIsStockChange(true);
    const updatedCount = stock?.filter((item) => item.id !== id);
    setStock(updatedCount || null);
  }

  const handleAddStock = (value: any) => {
    setSelectedOption("");
    setIsStockChange(true);
    setIsAddModal(false);
    if (!shop) return;
    let tempItem: Item = {
      id: 9999999,
      shop_id: shop?.id,
      quantity: value.quantity,
      name: value.name,
      price: value.price,
      type: value.type,
    };
    setStock((prev) => [...prev, tempItem] as Item[]);
    console.log(value)
    console.log(stock);
    console.log(requestStock);
  }

  const handleAvaibleItemType = () => {
    return itemTypes.filter((type) => !requestStock?.some((item) => item.type === type.id));
  }

  const handleSubmit = () => {
    // dispatch<any>(editItem(requestStock as ItemRequest))
  }

  useEffect(() => {
    dispatch<any>(getItemByShopId())
      .then((result: any) => {
        setStock(result);
        setRequestStock(result);
      });
    dispatch<any>(getAllItemType());
  }, [dispatch])

  // useEffect(() => {
  //   console.log(requestStock)
  // }, [requestStock])

  return (
    <Container className="mt-3">
      <Row lg={3} className="px-1 py-1 ">
        <Col>
          <Card className="rounded-4" style={{
            backgroundColor: "#0195ff", borderStyle: "none"
          }}>
            <div className="d-flex flex-row px-3">
              <div className="d-flex align-items-center me-2">
                <div className="d-flex rounded-circle p-3" style={{ backgroundColor: "#27a4ff" }}>
                  <BsCashCoin size={25} className="align-self-center text-white" />
                </div>
              </div>

              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="text-white">Shop Balance</span>
                  <span className="fs-2 fw-bold text-white">${shop?.wallet.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="rounded-4" style={{
            backgroundColor: "#01c283", borderStyle: "none"
          }}>
            <div className="d-flex flex-row px-3">
              <div className="d-flex align-items-center me-2">
                <div className="d-flex rounded-circle p-3" style={{ backgroundColor: "#26cb92" }}>
                  <BsCurrencyBitcoin size={25} className="align-self-center text-white" />
                </div>
              </div>

              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="text-white">Monthly Sale</span>
                  <span className="fs-2 fw-bold text-white">${(3453).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="rounded-4" style={{
            backgroundColor: "#884dff", borderStyle: "none"
          }}>
            <div className="d-flex flex-row px-3">
              <div className="d-flex align-items-center me-2">
                <div className="d-flex rounded-circle p-3" style={{ backgroundColor: "#9966ff" }}>
                  <BsArrowUpCircle size={25} className="align-self-center text-white" />
                </div>
              </div>

              <div className="d-flex justify-content-between py-3">
                <div className="d-flex flex-column justify-content-center">
                  <span className="text-white">Monthly Profit</span>
                  <span className="fs-2 fw-bold text-white">${shop?.wallet.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-between py-3">
          <span className="fs-5 fw-bold">Manage Panel</span>
          {!isEditStock ? (
            <Button className="text-white" onClick={() => setIsEditStock(true)}>Edit your stock</Button>
          ) : (
            <div>
              <Button
                variant="success"
                className="text-white me-2"
                onClick={() => setIsAddModal(true)}
              >
                Add Item
              </Button>
              <Button
                className="text-white me-2"
                disabled={!isStockChange}
                onClick={() => {
                  setIsEditStock(false);
                  setIsStockChange(false);
                  setRequestStock(stock);
                }}
              >
                Save you stock
              </Button>
              <Button
                className="text-white"
                onClick={() => {
                  setIsEditStock(false);
                  setIsStockChange(false);
                  setStock(requestStock);
                }}>
                Cancel
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <Table border={1}>
        <thead style={{ backgroundColor: "#758096" }} className="text-white">
          <tr>
            <th className="fw-normal">Item Name</th>
            <th className="fw-normal">Type</th>
            <th className="fw-normal text-center">Price</th>
            <th className="fw-normal text-center">Count</th>
            {isEditStock && <th className="fw-normal text-center">Delete</th>}
          </tr>
        </thead>
        <tbody>
          {stock && (stock.length != 0 ? stock.map((item) => (
            <tr className="align-middle" key={item.id}>
              <td>
                <div className="d-flex flex-column">
                  <span className="fw-bold">{item.name}</span>
                  <small style={{ color: "#758096" }} >Item Id: {item.id}</small>
                </div>
              </td>
              <td>{handleItemType(item.type)}</td>
              <td className="text-center">{item.price}</td>
              <td className="">
                {isEditStock ? (
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <Button
                      className="d-flex justify-content-center"
                      onClick={() => handleStockCountDecrease(item.id)}
                      style={{ background: "none", border: "none", padding: "0px" }}
                    >
                      <BsFillDashCircleFill color={"red"} />
                    </Button>
                    <span style={{ cursor: "pointer" }} onClick={() => handleCountSpan(item.id)}>{item.quantity}</span>
                    <Button
                      className="d-flex justify-content-center"
                      onClick={() => handleStockCountIncrease(item.id)}
                      style={{ background: "none", border: "none", padding: "0px" }}
                    >
                      <BsPlusCircleFill color={"lime"} />
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {item.quantity}
                  </div>
                )}
              </td>
              {isEditStock && <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button
                    className="d-flex justify-content-center"
                    onClick={() => { setIsStockChange(true); handleDelete(item.id); }}
                    style={{ background: "none", border: "none", padding: "0px" }}
                  >
                    <BsFillXSquareFill color="red" />
                  </Button>
                </div>
              </td>
              }
            </tr>
          )) : (
            <tr className="align-middle">
              <td>No Item</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
            </tr>
          ))}
          {!stock &&
            <tr className="align-middle">
              <td>Loading Item</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
            </tr>
          }
        </tbody>
      </Table>
      <Modal show={isAddModal} onHide={() => setIsAddModal(false)}>
        <Formik
          validationSchema={schema}
          onSubmit={handleAddStock}
          initialValues={initialValue}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            setFieldValue
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Add Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="name">
                    <Form.Label>Item name</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Oishi Yellow"
                        isValid={touched.name && !errors.name}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      isValid={touched.quantity && !errors.quantity}
                      isInvalid={!!errors.quantity}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      isValid={touched.price && !errors.price}
                      isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className="me-2">Item Type</Form.Label>
                  {selectedOption === '' && (
                    <Form.Text className="text-danger">
                      * Please select an option
                    </Form.Text>
                  )}
                  <Dropdown className="border rounded-2">
                    <Dropdown.Toggle variant="secondary" id="type" className="form-control" disabled={handleAvaibleItemType().length == 0}>
                      {selectedOption || "Select an option"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="form-control">
                      {handleAvaibleItemType().map((option) => (
                        <Dropdown.Item
                          key={option.id}
                          onClick={() => {
                            setFieldValue("type", option.id);
                            setSelectedOption(option.name)
                          }}
                        >
                          {option.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setIsAddModal(false)}>
                  Close
                </Button>
                <Button variant="primary" className="text-white" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Container>
  );
}

export default Stocking;