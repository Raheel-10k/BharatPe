import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: "",
        businessName: "",
        phone: "",
        address: "",
        email: "",
        merchantId: "",
        accountBalance: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5021/auth/info",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate("/login");
                        throw new Error("Please login to continue");
                    }
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();

                setProfile({
                    name: data.name || "",
                    businessName: data.businessName || "",
                    phone: data.phoneNumber || "",
                    address: data.businessAddress || "",
                    email: data.email || "",
                    merchantId: data.merchantId || "",
                    accountBalance: data.accountBalance || 0
                });
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch("http://localhost:5021/auth/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profile.name,
                    businessName: profile.businessName,
                    businessAddress: profile.address,
                    email: profile.email
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login");
                    throw new Error("Please login to continue");
                }
                throw new Error("Failed to update profile");
            }

            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white shadow rounded-lg">
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold mb-6">
                        Merchant Profile
                    </h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Business Name
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                value={profile.businessName}
                                onChange={handleInputChange}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Merchant ID
                            </label>
                            <input
                                type="text"
                                name="merchantId"
                                value={profile.merchantId}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Account Balance
                            </label>
                            <input
                                type="text"
                                value={`₹${profile.accountBalance.toLocaleString()}`}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Business Address
                            </label>
                            <textarea
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
