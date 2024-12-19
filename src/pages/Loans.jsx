import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Loans() {
    const [loans] = useState([
        {
            id: 1,
            amount: 50000,
            interest: 12,
            duration: 12,
            status: "approved",
            remainingAmount: 45000,
            nextPayment: "2024-04-01",
        },
    ]);

    const [availableLoans] = useState([
        {
            id: 1,
            type: "Personal Loan",
            maxAmount: 100000,
            interestRate: 10,
            duration: 12,
        },
        {
            id: 2,
            type: "Business Loan",
            maxAmount: 500000,
            interestRate: 8,
            duration: 24,
        },
        {
            id: 3,
            type: "Education Loan",
            maxAmount: 300000,
            interestRate: 7,
            duration: 36,
        },
    ]);

    const navigate = useNavigate(); // Initialize navigate hook

    return (
        <div className="space-y-6">
            {/* Existing Loans Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
                {loans.map((loan) => (
                    <div key={loan.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Loan Amount
                                </p>
                                <p className="font-semibold">₹{loan.amount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Interest Rate
                                </p>
                                <p className="font-semibold">
                                    {loan.interest}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Duration
                                </p>
                                <p className="font-semibold">
                                    {loan.duration} months
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-semibold capitalize text-green-500">
                                    {loan.status}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="bg-gray-100 p-4 rounded">
                                <p className="text-sm text-gray-500">
                                    Remaining Amount
                                </p>
                                <p className="font-semibold">
                                    ₹{loan.remainingAmount}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Next Payment Due
                                </p>
                                <p className="font-semibold">
                                    {loan.nextPayment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Apply for New Loan Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                    Apply for New Loan
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Loan Amount
                        </label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Duration (months)
                        </label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option>6</option>
                            <option>12</option>
                            <option>24</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Apply Now
                    </button>
                </form>
            </div>

            {/* Loan Opportunities Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                    Loan Opportunities
                </h2>
                {availableLoans.map((loan) => (
                    <div
                        onClick={() => navigate("/home")} // Navigate to home on click
                        key={loan.id}
                        className="loan-card border rounded-lg p-6 hover:shadow transition cursor-pointer"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Loan Type
                                </p>
                                <p className="font-semibold capitalize">
                                    {loan.type}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Maximum Amount
                                </p>
                                <p className="font-semibold">
                                    ₹{loan.maxAmount}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Interest Rate
                                </p>
                                <p className="font-semibold">
                                    {loan.interestRate}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Duration
                                </p>
                                <p className="font-semibold">
                                    {loan.duration} months
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">EMI</p>
                                <p className="font-semibold">
                                    ₹
                                    {(
                                        (loan.maxAmount *
                                            (1 + loan.interestRate / 100)) /
                                        loan.duration
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Loans;
