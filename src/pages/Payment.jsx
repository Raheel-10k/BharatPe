import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TransactionList from "../components/home/TransactionList";

function Payment() {
    const { state } = useLocation();
    const { fromMerchantId, user } = state || {};
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [transactions, setTransactions] = useState([]); // State to store transactions

    // Function to fetch transactions
    const fetchTransactions = async () => {
        try {
            const response = await fetch(
                `http://localhost:5021/transaction/ourTransactions?fromMerchantId=${fromMerchantId}&toMerchantId=${user.merchantId}`
            );

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions); // Store fetched transactions
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch transactions");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Error fetching transactions");
        }
    };

    // Fetch transactions when the component mounts or when user details change
    useEffect(() => {
        if (fromMerchantId && user?.merchantId) {
            fetchTransactions();
        }
    }, [fromMerchantId, user]);

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
                setError("");

                // Refresh transactions after successful payment
                fetchTransactions();
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Transaction failed");
                setSuccess("");
            }
        } catch (error) {
            console.error("Error processing transaction:", error);
            setError("Error processing transaction");
            setSuccess("");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">
                Payment to {user?.name || "Unknown User"}
            </h2>
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

            {/* Transaction List */}
            <TransactionList transactions={transactions} />
        </div>
    );
}

export default Payment;
