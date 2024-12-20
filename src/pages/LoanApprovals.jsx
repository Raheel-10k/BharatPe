import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5021';

function LoanApprovals() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            const merchantId = localStorage.getItem('merchantId');
            const token = localStorage.getItem('token');

            // Verify admin access
            if (phoneNumber !== '0123456789') {
                setError('Not authorized to view loan applications');
                navigate('/');
                return;
            }

            if (!phoneNumber || !merchantId || !token) {
                setError('Authentication required');
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/loans/applications`, {
                headers: {
                    'phone-number': phoneNumber,
                    'merchant-id': merchantId,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch applications');
            }

            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error.message || 'Failed to fetch loan applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        setUpdating(true);
        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            const merchantId = localStorage.getItem('merchantId');
            const token = localStorage.getItem('token');

            if (!phoneNumber || !merchantId || !token) {
                setError('Authentication required');
                navigate('/login');
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/loans/applications/${applicationId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'phone-number': phoneNumber,
                        'merchant-id': merchantId,
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update application status');
            }

            // Refresh applications list
            fetchApplications();
            setError('');
        } catch (error) {
            console.error('Error updating application:', error);
            setError(error.message || 'Failed to update application status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Loan Applications</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {applications.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 bg-gray-50">User ID</th>
                                <th className="px-4 py-2 bg-gray-50">Amount</th>
                                <th className="px-4 py-2 bg-gray-50">Interest Rate</th>
                                <th className="px-4 py-2 bg-gray-50">Duration</th>
                                <th className="px-4 py-2 bg-gray-50">Applied Date</th>
                                <th className="px-4 py-2 bg-gray-50">Status</th>
                                <th className="px-4 py-2 bg-gray-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id} className="border-b">
                                    <td className="px-4 py-2">{application.userId}</td>
                                    <td className="px-4 py-2">₹{application.loanId.amount}</td>
                                    <td className="px-4 py-2">{application.loanId.interestRate}%</td>
                                    <td className="px-4 py-2">{application.loanId.duration} months</td>
                                    <td className="px-4 py-2">
                                        {new Date(application.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {application.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(application._id, 'approved')}
                                                    disabled={updating}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(application._id, 'declined')}
                                                    disabled={updating}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    No loan applications found.
                </div>
            )}
        </div>
    );
}

export default LoanApprovals;
