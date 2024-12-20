import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../components/home/BalanceCard";
import TransactionList from "../components/home/TransactionList";
import QRCodeCard from "../components/home/QRCodeCard";
import SearchValueCard from "../components/home/SearchValueCard";

const API_BASE_URL = 'http://localhost:5021';

function Home() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [merchantId, setMerchantId] = useState(null);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchField, setSearchField] = useState("phoneNumber");
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [merchantDetails, setMerchantDetails] = useState({});

    useEffect(() => {
        const fetchMerchantDetails = async () => {
            try {
                const phoneNumber = localStorage.getItem('phoneNumber');
                if (!phoneNumber) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/account/details-by-phone?phoneNumber=${phoneNumber}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch merchant details');
                }

                const data = await response.json();
                setMerchantId(data.merchantId);
                setBalance(data.accountBalance || 0);
                setMerchantDetails(data);
                localStorage.setItem('merchantId', data.merchantId);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching merchant details:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        const fetchTransactions = async () => {
            if (!merchantId) return;
            
            try {
                const response = await fetch(
                    `${API_BASE_URL}/transactions/allTransactions?merchantId=${merchantId}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                setTransactions(data.transactions || []);
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError(err.message);
            }
        };

        fetchMerchantDetails();
        if (merchantId) {
            fetchTransactions();
        }
    }, [merchantId, navigate]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/account/search`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        query: searchQuery,
                        searchField: searchField 
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            setSearchResult(data);
            setError('');
        } catch (err) {
            console.error("Error searching:", err);
            setError(err.message);
            setSearchResult(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-bold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceCard balance={balance} />
                <QRCodeCard merchantId={merchantId} />
            </div>

            <SearchValueCard
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchField={searchField}
                setSearchField={setSearchField}
                handleSearch={handleSearch}
                searchResult={searchResult}
            />

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
}

export default Home;
