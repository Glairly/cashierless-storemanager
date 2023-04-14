import { useEffect, useState } from "react";
import { Button, Form, Modal, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import PrompyPayLogo from "../assets/prompt-pay-logo.png";
import CheckMarked from "./svgs/CheckMarked";
import { fetchWallet } from "../features/auth/authAPI";
import { topup } from "../features/transaction/transactionAPI";

interface TopupModalProps {
  show: boolean;
  onHide: () => void;
}

interface qrProp {
  qrcode: string;
  pending_topup_transaction_id: number;
}

const TopupModal: React.FC<TopupModalProps> = ({ show, onHide }) => {

  const [res, setRes] = useState<qrProp>();
  const [isTransactionComplete, setTransactionComplete] = useState(false);
  const [isTopupConfirm, setTopupConfirm] = useState(false);
  const [topupAmount, setTopupAmount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const genQr = async () => {
    if (!user?.id) return;

    setTransactionComplete(false);

    const request = {
      client_id: user.id,
      total_topup: topupAmount
    };

    try {
      const response = await fetch(
        "http://localhost:8000/fapi/v1/generate_promptpay_qr_topup",
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
        `http://localhost:8000/fapi/v1/get_pending_topup_transaction?pending_topup_transaction_id=${id}`
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
      if (!show) return;
      if (
        res?.pending_topup_transaction_id &&
        (await get_pending_transaction(res.pending_topup_transaction_id.toString()))
      ) {
        setTransactionComplete(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
        dispatch<any>(topup(topupAmount));
        dispatch<any>(fetchWallet());
      } else {
        intervalGetTransaction();
      }
    }, 1000);
  };

  useEffect(() => {
    intervalGetTransaction();
  }, [res]);

  const handleTopupConfirm = () => {
    setTopupConfirm(true);
    genQr();
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Topup</Modal.Title>
      </Modal.Header>
      {!isTopupConfirm ?
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Topup Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Must topup at least 20 Baht"
                min={20}
                onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setTopupAmount(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        :
        <Modal.Body>
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
        </Modal.Body>}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {!isTopupConfirm ?
          <Button
            variant="primary text-white"
            onClick={handleTopupConfirm}
          >
            Confirm Topup
          </Button>
          : (
            !isTransactionComplete ?
              <Button
                variant="primary text-white"
                disabled
              >
                Pending
              </Button>
              :
              <Button
                variant="primary text-white"
                onClick={() => setTopupConfirm(false)}
              >
                Back to Topup
              </Button>
          )
        }

      </Modal.Footer>
    </Modal>
  )
}

export default TopupModal;