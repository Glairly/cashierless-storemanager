import QrScanner from "qr-scanner";
import React, { useEffect, useRef, useState } from "react";

interface ScannerProps {}

const Scanner: React.FC<ScannerProps> = () => {
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner>();

  const handleScan = (result: QrScanner.ScanResult) => {
    console.log("The result is " + result.data);
  };

  const close = async () => {
    qrScanner?.stop();
    qrScanner?.destroy();
    setQrScanner(undefined);
  };

  useEffect(() => {
    if (video.current) {
      const qrScanner = new QrScanner(
        video.current,
        (result) => handleScan(result),
        {
          highlightScanRegion: true,
        }
      );
      qrScanner.start();
      setQrScanner(qrScanner);
    }
  }, [video.current]);

  return <video ref={video} className="w-100 rounded"></video>;
};

export default Scanner;
