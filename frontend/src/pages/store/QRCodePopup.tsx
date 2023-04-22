import { useEffect, useState } from "react";
import { Button, Modal, Image } from "react-bootstrap";
import { RootState, store } from "../../app/store";
import {
  Item,
  setCaptureImage,
  setCustomerInfo,
  setIdle,
  setInferenceResult,
} from "../../features/inference/inferenceSlice";
import {
  setIdle as setTransactionIdle
} from "../../features/transaction/transactionSlice";
import { useSelector } from "react-redux";
import PrompyPayLogo from "../../assets/prompt-pay-logo.png";
import CheckMarked from "../../components/svgs/CheckMarked";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  DoAnonyTransaction,
  DoTransaction,
  DoTransactionWithWallet,
} from "../../features/transaction/transactionAPI";
import { TransactionItemRequest } from "../../app/api";
import CrossMarked from "../../components/svgs/CrossMarked";

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
  const [getPendingStatus, setGetPendingStatus] = useState('');
  const [timeOutId, setTimeOutId] = useState<any>();
  const [payWithWallet, setPayWithWallet] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    inferenceResult,
    customerInfo,
    shop_id,
    error,
  } = useSelector((state: RootState) => state.inference);

  const {
    pendingStatus,
    isLoading
  } = useSelector((state: RootState) => state.transaction);

  const toRequestItem = (item: Item) => {
    return {
      item_id: item.id,
      quantity: item.quantity,
    };
  };

  const toTransactionItemRequest = (item: Item) => {
    return {
      itemId: item.id,
      itemName: item.name,
      quantity: item.quantity,
    } as TransactionItemRequest;
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
        "http://localhost:8000/fapi/v1/generate_promptpay_qr",
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
        `http://localhost:8000/fapi/v1/get_pending_transaction?pending_transaction_id=${id}`
      );
      const data = await response.json();
      if (data.status == "Complete" || data.status == "Failed") {
        setGetPendingStatus(data.status);
        return data.status;
      }
      setGetPendingStatus(data.status);
    } catch (error) { }
    return "Pending";
  };

  const intervalGetTransaction = function () {
    const getState = () => store.getState();
    if (!show) return;
    const id = setTimeout(async function () {
      const { transaction } = getState();
      if (
        res?.pending_transaction_id
      ) {
        const response = await get_pending_transaction(res.pending_transaction_id.toString());
        if (response == "Complete" || response == "Failed") {
          setTransactionComplete(true);
          setTimeout(() => {
            if (!inferenceResult) return;
            if (!shop_id) return;

            const items = inferenceResult.items.map((x) =>
              toTransactionItemRequest(x as Item)
            );
            if (transaction.pendingStatus == "idle" && response == "Complete") {
              if (customerInfo?.user?.id) {
                dispatch<any>(DoTransaction(items, []));
              } else {
                dispatch<any>(DoAnonyTransaction(items, []));
              }
            }

            dispatch<any>(setCustomerInfo(null));
            dispatch<any>(setInferenceResult(null));
            dispatch<any>(setCaptureImage(null));
            setRes(undefined);
            navigate("/store");
            clearTimeout(id);
          }, 5000);
        } else {
          intervalGetTransaction();
        }
      }
    }, 1000);

    setTimeOutId(id);
  };

  const handlePayWithWallet = () => {
    if (!inferenceResult) return;
    if (!res) return;
    const items = inferenceResult.items.map((x) =>
      toTransactionItemRequest(x as Item)
    );
    dispatch<any>(DoTransactionWithWallet(items, [], res?.pending_transaction_id));
    setPayWithWallet(true);
  }

  useEffect(() => {
    if (show) {
      genQr();
    } else {
      window.clearTimeout(timeOutId);
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
            {customerInfo &&
              <Button
                variant="success text-white w-100 my-2"
                disabled={isLoading}
                onClick={handlePayWithWallet}
              >
                Checkout with wallet
              </Button>}
          </div>
        ) : (
          pendingStatus == "fulfilled" || getPendingStatus == "Complete" ? (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <CheckMarked />
              <p>Transaction Completed</p>
            </div>
          ) : (
            pendingStatus == "rejected" || getPendingStatus == "Failed" ? (
              <div className="d-flex flex-column justify-content-center align-items-center">
                <CrossMarked />
                <p>{error || "Error occurs"}</p>
              </div>) : (<></>)
          ))}
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
