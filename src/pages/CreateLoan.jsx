import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5021';

function CreateLoan() {
    const [formData, setFormData] = useState({
        amount: '',
        interestRate: '',
        duration: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const phoneNumber = localStorage.getItem('phoneNumber');
        if (phoneNumber !== '0123456789') {
            navigate('/');
            return;
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            const merchantId = localStorage.getItem('merchantId');
            
            if (!phoneNumber || !merchantId) {
                setError('Authentication failed');
                return;
            }

            if (phoneNumber !== '0123456789') {
                setError('Not authorized to create loans');
                return;
            }

            // Validate input
            const amount = parseFloat(formData.amount);
            const interestRate = parseFloat(formData.interestRate);
            const duration = parseInt(formData.duration);

            if (isNaN(amount) || isNaN(interestRate) || isNaN(duration)) {
                setError('Please enter valid numbers');
                return;
            }

            if (amount <= 0 || interestRate <= 0 || duration <= 0) {
                setError('Values must be greater than 0');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/loans/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'phone-number': phoneNumber,
                    'merchant-id': merchantId
                },
                body: JSON.stringify({
                    amount,
                    interestRate,
                    duration
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create loan');
            }

            const data = await response.json();
            setSuccess('Loan created successfully!');
            setFormData({
                amount: '',
                interestRate: '',
                duration: ''
            });
        } catch (error) {
            console.error('Error creating loan:', error);
            setError(error.message || 'Failed to create loan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Create Pre-approved Loan</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount (₹)
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        min="1000"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount (min ₹1,000)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interest Rate (% per year)
                    </label>
                    <input
                        type="number"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="1"
                        max="20"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter interest rate (1-20%)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (months)
                    </label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="60"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter duration (1-60 months)"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded text-white transition-colors ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Creating...' : 'Create Loan'}
                </button>
            </form>
        </div>
    );
}

export default CreateLoan;
