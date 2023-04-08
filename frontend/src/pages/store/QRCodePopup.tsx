import { useEffect, useState } from "react";
import { Button, Modal, Image } from "react-bootstrap";
import { RootState } from "../../app/store";
import {
  Item,
  setInferenceResult,
} from "../../features/inference/inferenceSlice";
import { useSelector } from "react-redux";

import PrompyPayLogo from "../../assets/prompt-pay-logo.png";
import CheckMarked from "../../components/svgs/CheckMarked";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

interface QRCodePopupProps {
  show: boolean;
  onHide: () => void;
}

interface qrProp {
  qrcode: string;
  pending_transaction_id: number;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ show, onHide }) => {
  const [res, setRes] = useState<qrProp>();
  const [isTransactionComplete, setTransactionComplete] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { inferenceResult, shop_id, pendingStatus, isLoading, error } =
    useSelector((state: RootState) => state.inference);

  const toRequestItem = (item: Item) => {
    return {
      item_id: item.id,
      quantity: 1,
    };
  };

  const genQr = async () => {
    if (!inferenceResult) return;
    if (!shop_id) return;

    setTransactionComplete(false);

    const request = {
      client_id: 0,
      shop_id: shop_id,
      items: inferenceResult.items.map((x) => toRequestItem(x as Item)),
      barcodes: [],
    };

    try {
      const response = await fetch(
        "http://localhost/fapi/v1/generate_promptpay_qr",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      const data = await response.json();
      setRes({ ...data } as qrProp);
    } catch (error) {}
  };

  const get_pending_transaction = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost/fapi/v1/get_pending_transaction?pending_transaction_id=${id}`
      );
      const data = await response.json();
      if (data.status == "Complete") {
        return true;
      }
    } catch (error) {}

    return false;
  };

  const intervalGetTransaction = function () {
    setTimeout(async function () {
      if (!show) return;
      if (
        res?.pending_transaction_id &&
        (await get_pending_transaction(res.pending_transaction_id.toString()))
      ) {
        setTransactionComplete(true);

        setTimeout(() => {
          dispatch<any>(setInferenceResult(null));
          navigate("/store");
        }, 5000);
      } else {
        intervalGetTransaction();
      }
    }, 1000);
  };

  useEffect(() => {
    if (show) {
      genQr();
    }
  }, [show]);

  useEffect(() => {
    intervalGetTransaction();
  }, [res]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>Scan Here</Modal.Header>
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
          </div>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <CheckMarked />
            <p>Transaction Complated</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRCodePopup;