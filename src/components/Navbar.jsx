import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../components/Navbar.css";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const phoneNumber = localStorage.getItem("phoneNumber");
            setIsLoggedIn(!!phoneNumber);
            setIsAdmin(phoneNumber === "0123456789");
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        window.addEventListener('loginStatusChanged', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear()
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.dispatchEvent(new Event('loginStatusChanged'));
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <div className="logo">
                        <Link to={isLoggedIn ? "/" : "/login"}>
                            <img
                                src="https://coralogix.com/wp-content/uploads/2024/08/BharatPe-Logo.png"
                                alt="BharatPe Logo"
                                className="h-8"
                            />
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        {isLoggedIn ? (
                            <>
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
                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/create-loan"
                                            className="text-gray-700 hover:text-blue-500 mt-[5px]"
                                        >
                                            Create Loan
                                        </Link>
                                        <Link
                                            to="/loan-approvals"
                                            className="text-gray-700 hover:text-blue-500 mt-[5px]"
                                        >
                                            Loan Approvals
                                        </Link>
                                    </>
                                )}
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
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
