import { useState } from "react";
import { useLocation } from "react-router-dom";

function Payment() {
    const { state } = useLocation();
    const { fromMerchantId, user } = state || {};
    const [amount, setAmount] = useState();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handlePayment = async () => {
        try {
            const response = await fetch(
                "http://localhost:5021/transaction/send",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fromMerchantId,
                        toMerchantId: user.merchantId,
                        amount,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSuccess("Transaction successful!");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Transaction failed");
            }
        } catch (error) {
            setError("Error processing transaction");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment to {user.name}</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="border p-2 rounded w-full"
            />
            <button
                onClick={handlePayment}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Send Payment
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>
    );
}

export default Payment;
