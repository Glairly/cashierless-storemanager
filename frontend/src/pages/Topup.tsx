import { Button, Card, Container, Form, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { topup } from "../features/transaction/transactionAPI";
import { fetchWallet } from "../features/auth/authAPI";
import PrompyPayLogo from "../assets/prompt-pay-logo.png";
import CheckMarked from "../components/svgs/CheckMarked";

interface qrProp {
  qrcode: string;
  pending_topup_transaction_id: number;
}

const Topup: React.FC = () => {
  const [validated, setValidate] = useState(false);
  const [res, setRes] = useState<qrProp>();
  const [isTransactionComplete, setTransactionComplete] = useState(false);
  const [isTopupConfirm, setTopupConfirm] = useState(false);
  const [topupAmount, setTopupAmount] = useState(20);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wallet = useSelector((state: RootState) => state.auth.wallet);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  const genQr = async () => {
    if (!user?.id) return;

    setTransactionComplete(false);

    const request = {
      client_id: user.id,
      total_topup: topupAmount
    };

    try {
      const response = await fetch(
        "http://localhost/fapi/v1/generate_promptpay_qr_topup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      const data = await response.json();
      setRes({ ...data } as qrProp);
    } catch (error) { }
  };

  const get_pending_transaction = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost/fapi/v1/get_pending_topup_transaction?pending_topup_transaction_id=${id}`
      );
      const data = await response.json();
      if (data.status == "Complete") {
        return true;
      }
    } catch (error) { }
    return false;
  };

  const intervalGetTransaction = function () {
    setTimeout(async function () {
      if (
        res?.pending_topup_transaction_id &&
        (await get_pending_transaction(res.pending_topup_transaction_id.toString()))
      ) {
        setTransactionComplete(true);

        setTimeout(() => {
          navigate("/new2");
          window.location.reload();
        }, 5000);
        dispatch<any>(topup(topupAmount));
        dispatch<any>(fetchWallet());
      } else {
        intervalGetTransaction();
      }
    }, 1000);
  };

  useEffect(() => {
    dispatch<any>(fetchWallet());
    intervalGetTransaction();
  }, [res]);

  const handleTopupConfirm = () => {
    setTopupConfirm(true);
    genQr();
  }

  return (
    <Container className="mt-3 p-3">
      {!isTopupConfirm ?
        (<Card style={{ width: '100%', backgroundColor: "#bcffb2" }} className="border-0 rounded-5">
          <Card
            style={
              {
                borderLeft: "15px solid #1ee500",
                borderRight: "15px solid #1ee500",
                backgroundColor: "#117f00",
                borderTopRightRadius: "2rem",
                borderTopLeftRadius: "2rem",
                borderBottomRightRadius: "0rem",
                borderBottomLeftRadius: "0rem"
              }
            }
          >
            <Card.Body className="d-flex flex-column text-white text-center">
              <span className="fs-1 fw-bold">$ {wallet?.balance.toFixed(2)}</span>
              <span>Wallet ID : {wallet?.id}</span>
            </Card.Body>
          </Card>
          <Card.Body className="text-center">
            <Card.Title className="fs-4 fw-bold" style={{ color: "#117f00" }}>Topup Service</Card.Title>
            <Card.Text>
              Welcome to Cashierless Topup service!
              <br />
              Please input Topup Amount
            </Card.Text>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              className="d-flex justify-content-center"
            >
              <Form.Control
                required
                type="number"
                placeholder="Must be at least 20 baht."
                defaultValue={20}
                min={20}
                style={{ width: "250px" }}
                className="text-center"
                onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setTopupAmount(parseInt(e.target.value))}
              />
            </Form>
            <Button
              variant="primary my-3 text-white"
              style={{ width: "250px", backgroundColor: "#117f00" }}
              onClick={handleTopupConfirm}
            >
              Topup
            </Button>
          </Card.Body>
        </Card>
        ) : (
          <Card className="border-0">
            {!isTransactionComplete ? (
              <div className="d-flex flex-column align-items-center  justify-content-center">
                {res?.qrcode ? (
                  <>
                    <img
                      className="w-50 h-50"
                      src={"data:image/png;base64," + res?.qrcode}
                      alt=""
                    />
                  </>
                ) : (
                  "Loading..."
                )}
                <Image
                  className="mx-auto my-2"
                  style={{ width: 100 }}
                  src={PrompyPayLogo}
                />
              </div>) : (
              <div className="d-flex flex-column justify-content-center align-items-center">
                <CheckMarked />
                <p>Topup Completed</p>
              </div>
            )}
          </Card>
        )}
    </Container>
  );
}

export default Topup