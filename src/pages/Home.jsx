import { useState, useEffect } from "react";
import BalanceCard from "../components/home/BalanceCard";
import TransactionList from "../components/home/TransactionList";
import QRCodeCard from "../components/home/QRCodeCard";

function Home() {
    const [transactions] = useState([
        { id: 1, amount: 500, date: "2024-03-15", type: "credit" },
        { id: 2, amount: 1000, date: "2024-03-14", type: "debit" },
        { id: 3, amount: 750, date: "2024-03-13", type: "credit" },
        { id: 4, amount: 10000, date: "2024-03-13", type: "credit" },
    ]);

    const [merchantId, setMerchantId] = useState(null);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    useEffect(() => {
        const phoneNumber = localStorage.getItem("phoneNumber");
        console.log(phoneNumber);

        const fetchMerchantDetails = async () => {
            if (!phoneNumber) {
                setError("Phone number is missing from localStorage.");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5021/account/details-by-phone?phoneNumber=${phoneNumber}`
                );

                if (response.ok) {
                    const data = await response.json();

                    localStorage.setItem("merchantId", data.merchantId);
                    setMerchantId(data.merchantId);

                    setBalance(data.amount);
                } else {
                    const errorData = await response.json();
                    setError(
                        errorData.message || "Failed to fetch merchant details"
                    );
                }
            } catch (error) {
                console.error("Error fetching merchant details:", error);
                setError("Error fetching merchant details");
            }
        };

        fetchMerchantDetails();
    }, []);

    // Filter transactions based on the search query
    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.amount.toString().includes(searchQuery) ||
            transaction.date.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            {error && <div className="text-red-500">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BalanceCard balance={balance} />

                {/* Transactions Today Card with Search */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">
                        Transactions Today
                    </h3>
                    <p className="text-2xl font-bold">
                        {filteredTransactions.length}
                    </p>
                </div>

                <QRCodeCard merchantId={merchantId} />
            </div>

            <TransactionList transactions={filteredTransactions} />
        </div>
    );
}

export default Home;
