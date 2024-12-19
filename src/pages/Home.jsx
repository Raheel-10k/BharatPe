import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../components/home/BalanceCard";
import TransactionList from "../components/home/TransactionList";
import QRCodeCard from "../components/home/QRCodeCard";
import SearchValueCard from "../components/home/SearchValueCard";

function Home() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [merchantId, setMerchantId] = useState(null);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchField, setSearchField] = useState("phoneNumber");
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        const phoneNumber = localStorage.getItem("phoneNumber");

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
                    fetchTransactions(data.merchantId);
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

        const fetchTransactions = async (merchantId) => {
            try {
                const response = await fetch(
                    `http://localhost:5021/transaction/allTransactions?merchantId=${merchantId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data.transactions); // Set fetched transactions
                } else {
                    const errorData = await response.json();
                    setError(
                        errorData.message || "Failed to fetch transactions"
                    );
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Error fetching transactions");
            }
        };

        fetchMerchantDetails();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:5021/account/search`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query: searchQuery }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSearchResult(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "User not found");
                setSearchResult(null);
            }
        } catch (error) {
            console.error("Error during search:", error);
            setError("Error during search");
            setSearchResult(null);
        }
    };
    return (
        <div className="space-y-6">
            {error && <div className="text-red-500 font-semibold">{error}</div>}

            {/* Search Bar */}
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-orange-400 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-xl font-bold mb-4 text-center">
                    Search for Users
                </h3>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="bg-white text-gray-700 border-none rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    >
                        <option value="phoneNumber">Phone Number</option>
                        <option value="name">Name</option>
                        <option value="businessName">Business Name</option>
                        <option value="email">Email</option>
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter search value"
                        className="bg-white text-gray-700 border-none rounded-full px-6 py-2 shadow flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow transition focus:ring-2 focus:ring-green-400 focus:outline-none"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BalanceCard balance={balance} />
                <QRCodeCard merchantId={merchantId} />
            </div>

            {/* Display Search Result */}
            {searchResult && (
                <SearchValueCard
                    user={searchResult}
                    onClick={() =>
                        navigate("/payment", {
                            state: {
                                fromMerchantId: merchantId,
                                user: searchResult,
                            },
                        })
                    }
                />
            )}

            {/* Transaction List Component */}
            <TransactionList transactions={transactions} />
        </div>
    );
}

export default Home;
