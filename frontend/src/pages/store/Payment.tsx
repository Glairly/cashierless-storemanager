import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Item } from "../../features/inference/inferenceSlice";

interface qrProp {
  qrcode: string;
  pending_transaction_id: number;
}

const Payment: React.FC = () => {
  const [res, setRes] = useState<qrProp>();

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
      setRes(data);
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
    } catch (error) {
    }

    return false;
  };

  const intervalGetTransaction = () => {
    setTimeout(async () => {
      if (
        res?.pending_transaction_id &&
        (await get_pending_transaction(res.pending_transaction_id.toString()))
      ) {
        alert("Transaction Complete Proceed to something");
      } else {
        intervalGetTransaction();
      }
    }, 1000);
  };

  useEffect(() => {
    setTimeout(genQr, 2000);
    intervalGetTransaction();
  }, [inferenceResult]);
  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-center">
        {/* <h1>{data?.items[0].item_id}</h1> */}
        <img
          className="w-50 h-50"
          src={"data:image/png;base64," + res?.qrcode}
          alt=""
        />
      </div>
      <p className="text-center">Please scan here!</p>
    </div>
  );
};

export default Payment;
