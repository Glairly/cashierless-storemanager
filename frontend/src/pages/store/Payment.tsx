import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pay } from "./model";

interface PaymentProps {
  client_id: number;
  shop_id: number;
  items: Pay[];
  barcodes: [];
}

interface qrProp {
  qrcode: string;
  pending_transaction_id: number;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<PaymentProps>();
  const [res, setRes] = useState<qrProp>();

  const genQr = async () => {
    const request: PaymentProps = {
      client_id: 6,
      shop_id: 3,
      items: location.state.items,
      barcodes: [],
    };

    console.log(request);

    try {
      const response = await fetch(
        "http://localhost:8000/fapi/v1/generate_promptpay_qr",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          // mode: "no-cors",
        }
      );
      const data = await response.json();
      console.log("Helloworld:", data);
      setRes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const get_pending_transaction = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/fapi/v1/get_pending_transaction?pending_transaction_id=${id}`
      );
      const data = await response.json();
      if (data.status == "Complete") {
        return true;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    return false;
  };

  const intervalGetTransaction = () => {
    setTimeout(async () => {
      console.log("Checking..");
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
    setData(location.state);
    setTimeout(genQr, 2000);
    intervalGetTransaction();
  }, []);
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
