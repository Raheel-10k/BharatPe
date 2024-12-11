import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    createPayment,
    verifyPayment,
    getTransactions,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.use(protect);

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.get("/transactions", getTransactions);

export default router;
