import React, { useState, useEffect } from "react";

function QRCodeCard({ merchantId }) {
    console.log(merchantId);
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the QR code from the backend
        const fetchQRCode = async () => {
            console.log("This", merchantId);
            try {
                const response = await fetch(
                    `http://localhost:5021/auth/qr/${merchantId}`
                ); // Adjust API endpoint if necessary

                // Log the response for debugging
                const text = await response.text();
                console.log("Response:", text); // Logs the raw response

                if (!response.ok) {
                    throw new Error("Failed to fetch QR code");
                }

                // Try parsing the response as JSON
                const data = JSON.parse(text);
                console.log("get", text);
                console.log(qrCode);
                setQrCode(data.qrCode); // Assuming QR code is returned as base64 string
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQRCode();
    }, [merchantId]);

    if (loading) {
        return <div>Loading QR code...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
            {qrCode ? (
                <img
                    src={`${qrCode}`}
                    alt="Merchant QR Code"
                    className="w-24 h-24"
                />
            ) : (
                <div>No QR code available</div>
            )}
        </div>
    );
}

export default QRCodeCard;
