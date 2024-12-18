import express from "express";
import AccountDetails from "../models/AccountDetails.js";
import Merchant from "../models/Merchant.js";

const router = express.Router();

// POST: Create Account Details
router.post("/create", async (req, res) => {
    const { merchantId, amount } = req.body;
    try {
        // Check if merchant exists
        const merchant = await Merchant.findOne({ merchantId });
        if (!merchant) {
            return res.status(400).json({ message: "Merchant not found" });
        }

        // Create or update account details
        const accountDetails = await AccountDetails.findOneAndUpdate(
            { merchantId },
            { amount },
            { upsert: true, new: true }
        );

        res.status(201).json({
            message: "Account details created/updated",
            accountDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET: Fetch Account Details by Phone Number
router.get("/details-by-phone", async (req, res) => {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    try {
        // Find merchant by phone number
        const merchant = await Merchant.findOne({ phoneNumber });
        if (!merchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }

        // Find account details for the found merchant
        const accountDetails = await AccountDetails.findOne({
            merchantId: merchant.merchantId,
        });
        if (!accountDetails) {
            return res
                .status(404)
                .json({ message: "Account details not found" });
        }

        // Return merchant and account details
        res.status(200).json({
            message: "Account details fetched successfully",
            merchantId: merchant.merchantId,
            accountNumber: accountDetails.accountNumber,
            amount: accountDetails.amount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
