import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5021';

function Loans() {
    const [loans, setLoans] = useState([]);
    const [userLoans, setUserLoans] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [userLoansLoading, setUserLoansLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApprovedLoan, setHasApprovedLoan] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const phoneNumber = localStorage.getItem('phoneNumber');
        const merchantId = localStorage.getItem('merchantId');
        const token = localStorage.getItem('token');
        
        if (!phoneNumber || !merchantId || !token) {
            setError('Please login to view loans');
            navigate('/login');
            return;
        }

        fetchLoans();
        fetchUserLoans();
    }, [navigate]);

    const fetchLoans = async () => {
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            const merchantId = localStorage.getItem('merchantId');
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/loans`, {
                headers: {
                    'phone-number': phoneNumber,
                    'merchant-id': merchantId,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch loans');
            }

            const data = await response.json();
            console.log('Fetched loans:', data);
            setLoans(data);
        } catch (error) {
            console.error('Error fetching loans:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLoans = async () => {
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            const merchantId = localStorage.getItem('merchantId');
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/loans/my-applications`, {
                headers: {
                    'phone-number': phoneNumber,
                    'merchant-id': merchantId,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch your loans');
            }

            const data = await response.json();
            setUserLoans(data);
            
            // Check if user has any approved loans
            const hasApproved = data.some(loan => loan.status === 'approved');
            setHasApprovedLoan(hasApproved);
        } catch (error) {
            console.error('Error fetching user loans:', error);
            setError(error.message);
        } finally {
            setUserLoansLoading(false);
        }
    };

    const handleApplyLoan = async (loanId) => {
        if (hasApprovedLoan) {
            setError('You already have an approved loan. Cannot apply for another loan.');
            return;
        }

        setApplying(true);
        setError('');
        setSuccess('');
        
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            const merchantId = localStorage.getItem('merchantId');
            const token = localStorage.getItem('token');

            // Check if we have all authentication values
            if (!phoneNumber || !merchantId || !token) {
                setError('Please login to apply for a loan');
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/loans/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'phone-number': phoneNumber,
                    'merchant-id': merchantId,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ loanId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to apply for loan');
            }

            setSuccess('Loan application submitted successfully!');
            fetchUserLoans(); // Refresh user loans
        } catch (error) {
            console.error('Error applying for loan:', error);
            setError(error.message);
        } finally {
            setApplying(false);
        }
    };

    if (loading || userLoansLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                </div>
            )}

            {/* Available Loans */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Available Loans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loans.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center">No loans available at the moment</p>
                    ) : (
                        loans.map((loan) => (
                            <div key={loan._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">₹{loan.amount?.toLocaleString() || 'N/A'}</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Interest Rate</p>
                                            <p>{loan.interestRate || 'N/A'}% per year</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Duration</p>
                                            <p>{loan.duration || 'N/A'} months</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">EMI per Month</p>
                                            <p>₹{loan.EMIperMonth?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Total Payback</p>
                                            <p>₹{loan.TotalPayBack?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApplyLoan(loan._id)}
                                    disabled={hasApprovedLoan || applying}
                                    className={`mt-4 w-full py-2 px-4 rounded text-white transition-colors ${
                                        hasApprovedLoan || applying
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {applying ? 'Applying...' : hasApprovedLoan ? 'Already Have a Loan' : 'Apply Now'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* User's Loan Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Your Loan Applications</h2>
                <div className="space-y-4">
                    {userLoans.length === 0 ? (
                        <p className="text-gray-500">No loan applications found</p>
                    ) : (
                        userLoans.map((application) => {
                            // Skip if loanId is not populated
                            if (!application.loanId) return null;
                            
                            return (
                                <div key={application._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold">₹{application.loanId.amount?.toLocaleString() || 'N/A'}</h3>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Interest Rate</p>
                                                    <p>{application.loanId.interestRate || 'N/A'}% per year</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Duration</p>
                                                    <p>{application.loanId.duration || 'N/A'} months</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">EMI per Month</p>
                                                    <p>₹{application.loanId.EMIperMonth?.toLocaleString() || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Total Payback</p>
                                                    <p>₹{application.loanId.TotalPayBack?.toLocaleString() || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <p className={`mt-2 font-semibold ${
                                                application.status === 'approved' ? 'text-green-600' :
                                                application.status === 'declined' ? 'text-red-600' :
                                                'text-yellow-600'
                                            }`}>
                                                Status: {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(application.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Loans;
