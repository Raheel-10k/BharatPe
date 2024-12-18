import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        phoneNumber: "",
        email: "",
        businessAddress: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message
        setLoading(true); // Show loading indicator

        const {
            name,
            businessName,
            phoneNumber,
            email,
            businessAddress,
            password,
            confirmPassword,
        } = formData;
        console.log(phoneNumber);

        // Validate form data
        if (
            !name ||
            !businessName ||
            !phoneNumber ||
            !email ||
            !businessAddress ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Call backend API
            const response = await fetch(
                `http://localhost:5021/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        businessName,
                        phoneNumber,
                        email,
                        businessAddress,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            // Store the phone number in localStorage
            localStorage.setItem("phoneNumber", phoneNumber);

            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            console.error("Error during registration:", err);
            setError(err.message || "Server error. Please try again later.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register your business
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Name */}
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        {/* Business Name */}
                        <div>
                            <input
                                id="businessName"
                                name="businessName"
                                type="text"
                                required
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Business Name"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                            />
                        </div>
                        {/* Business Address */}
                        <div>
                            <input
                                id="businessAddress"
                                name="businessAddress"
                                type="text"
                                required
                                value={formData.businessAddress}
                                onChange={handleChange}
                                placeholder="Business Address"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                            />
                        </div>
                        {/* Confirm Password */}
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-500"
                    >
                        Already have an account? Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
