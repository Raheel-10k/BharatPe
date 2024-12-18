import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../components/Navbar.css";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // change to AuthContext
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    {/* <div className="text-xl font-semibold text-gray-700">BharatPe</div> */}
                    <div className="logo">
                        <img
                            src="https://coralogix.com/wp-content/uploads/2024/08/BharatPe-Logo.png"
                            alt=""
                        />
                    </div>
                    {isLoggedIn ? (
                        <div className="flex space-x-4">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-blue-500 mt-[5px]"
                            >
                                Home
                            </Link>
                            <Link
                                to="/loans"
                                className="text-gray-700 hover:text-blue-500 mt-[5px]"
                            >
                                Loans
                            </Link>
                            <Link
                                to="/profile"
                                className="text-gray-700 hover:text-blue-500 mt-[5px]"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/analytics"
                                className="text-gray-700 hover:text-blue-500 mt-[5px]"
                            >
                                Analytics
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 border-2 border-blue-0 px-1 py-1 rounded-md text-gray-700 hover:text-blue-500 hover:border-blue-700 transition duration-300"
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                    alt="User Icon"
                                    className="w-5 h-5"
                                />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-500"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-gray-700 hover:text-blue-500"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
