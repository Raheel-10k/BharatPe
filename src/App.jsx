import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Loans from "./pages/Loans";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Analytics from "./pages/Analytics";
import Payment from "./pages/Payment";
import CreateLoan from "./pages/CreateLoan";
import LoanApprovals from "./pages/LoanApprovals";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/loans" element={<Loans />} />
                            <Route path="/create-loan" element={<CreateLoan />} />
                            <Route path="/loan-approvals" element={<LoanApprovals />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/payment" element={<Payment />} />
                        </Route>
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
