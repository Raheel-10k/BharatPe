import { useState, useEffect } from "react";

function TransactionList({ transactions = [] }) {  
    const [searchQuery, setSearchQuery] = useState(""); 
    const [filteredTransactions, setFilteredTransactions] = useState([]);  

    // Filter transactions based on the search query
    useEffect(() => {
        if (!Array.isArray(transactions)) return;  
        
        const filtered = transactions.filter(
            (transaction) =>
                transaction?.amount?.toString()?.includes(searchQuery) ||
                transaction?.timestamp?.includes(searchQuery)
        );
        setFilteredTransactions(filtered);
    }, [searchQuery, transactions]);

    if (!Array.isArray(transactions)) {
        return <div className="p-4">Loading transactions...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search transactions"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border rounded-md shadow-sm"
                    />
                </div>

                <h2 className="text-xl font-semibold mb-4">
                    Recent Transactions
                </h2>
                <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                        <p>No transactions found.</p>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div
                                key={transaction._id}
                                className="flex justify-between items-center p-4 border rounded"
                            >
                                <div>
                                    <p className="font-semibold">
                                        ₹{transaction.amount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            transaction.timestamp
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`font-medium ${
                                        transaction.TransactionType === "sent"
                                            ? "text-red-500"
                                            : "text-green-500"
                                    }`}
                                >
                                    {transaction.TransactionType === "sent"
                                        ? "Sent"
                                        : "Received"}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransactionList;
