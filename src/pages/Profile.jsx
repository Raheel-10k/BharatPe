import { useState, useEffect } from "react";

function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        businessName: "",
        phone: "",
        address: "",
        email: "",
        merchantId: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const phoneNumber = localStorage.getItem("phoneNumber");
                const response = await fetch(
                    "http://localhost:5021/auth/info",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ phoneNumber }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();

                setProfile({
                    name: data.name,
                    businessName: data.businessName,
                    phone: data.phoneNumber,
                    address: data.businessAddress,
                    email: data.email,
                    merchantId: data.merchantId,
                });

                setLoading(false);
            } catch (err) {
                setError(err.message || "Something went wrong.");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the updated profile data to the backend
        console.log("Updated profile:", profile);
        alert("Profile updated successfully!");
    };

    if (loading) {
        return <p className="text-center">Loading profile...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg">
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold mb-6">
                        Edit Merchant Profile
                    </h2>
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
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Merchant ID
                        </label>
                        <input
                            type="text"
                            name="merchantId"
                            value={profile.merchantId}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300"
                            readOnly
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Merchant ID cannot be edited.
                        </p>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
