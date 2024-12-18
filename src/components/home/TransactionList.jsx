import { useState } from "react";

function TransactionList({ transactions }) {
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    // Filter transactions based on the search query
    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.amount.toString().includes(searchQuery) ||
            transaction.date.includes(searchQuery)
    );

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
                    {/* Search Button (optional, if you prefer a button over auto-filter) */}
                    <button
                        onClick={() => setSearchQuery(searchQuery)}
                        className="ml-2 p-2 border-2 rounded-md bg-blue-500 text-white"
                    >
                        Search
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-4">
                    Recent Transactions
                </h2>
                <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex justify-between items-center p-4 border rounded"
                        >
                            <div>
                                <p className="font-semibold">
                                    ₹{transaction.amount}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {transaction.date}
                                </p>
                            </div>
                            <span className="text-green-500 font-medium">
                                {transaction.type === "credit"
                                    ? "Received"
                                    : "Sent"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TransactionList;
