import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRCodeCard({ merchantId }) {
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        // Fetch the QR code from the backend
        const fetchQRCode = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5021/auth/qr/${merchantId}`
                );
                const text = await response.text();
                if (!response.ok) {
                    throw new Error("Failed to fetch QR code");
                }
                const data = JSON.parse(text);
                setQrCode(data.qrCode); // Assuming QR code is returned as base64 string
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQRCode();
    }, [merchantId]);

    const startScanning = () => {
        setScanning(true);
        const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        html5QrcodeScanner.render(
            (decodedText) => {
                console.log("Scanned QR Code:", decodedText);
                html5QrcodeScanner.clear(); // Stop scanning
                setScanning(false);
            },
            (errorMessage) => {
                console.error("QR Code Scan Error:", errorMessage);
            }
        );
    };

    if (loading) {
        return <div>Loading QR code...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
            <div className="flex justify-between items-center">
                {qrCode ? (
                    //onclick for scanner
                    <img
                        src={`${qrCode}`}
                        alt="Merchant QR Code"
                        className="w-24 h-24"
                    />
                ) : (
                    <div>No QR code available</div>
                )}

                <img
                    src="data:image/png;base64,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"
                    alt="Make Payment"
                    className="w-24 h-24"
                    onClick={startScanning}
                />
            </div>
        </div>
    );
}

export default QRCodeCard;
