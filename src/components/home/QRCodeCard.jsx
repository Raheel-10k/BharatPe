import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const API_BASE_URL = 'http://localhost:5021';

function QRCodeCard({ merchantId }) {
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        const fetchQRCode = async () => {
            if (!merchantId) return;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/qr/${merchantId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch QR code');
                }
                const data = await response.json();
                setQrCode(data.qrCode);
                setError(null);
            } catch (err) {
                console.error('Error fetching QR code:', err);
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
                try {
                    const scannedData = JSON.parse(decodedText);
                    console.log("Scanned QR Code Data:", scannedData);
                    // Handle the scanned data (e.g., navigate to payment page)
                    html5QrcodeScanner.clear();
                    setScanning(false);
                } catch (err) {
                    console.error("Invalid QR Code data:", err);
                    setError("Invalid QR Code");
                }
            },
            (errorMessage) => {
                console.error("QR Code Scan Error:", errorMessage);
            }
        );
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Your QR Code</h3>
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Your QR Code</h3>
            {error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <>
                    {qrCode && (
                        <div className="flex justify-center mb-4">
                            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                            onClick={startScanning}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
                        >
                            {scanning ? "Scanning..." : "Scan QR Code"}
                        </button>
                    </div>
                    {scanning && <div id="qr-reader" className="mt-4"></div>}
                </>
            )}
        </div>
    );
}

export default QRCodeCard;
