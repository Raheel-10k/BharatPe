import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/database.js";
import merchantRoutes from "./routes/merchant.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/merchants", merchantRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/loans", loanRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5001;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
