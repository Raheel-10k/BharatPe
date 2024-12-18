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

// Add a search route for merchants
router.post("/search", async (req, res) => {
    const { query } = req.body; // Accept a search query from the frontend

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Search for a merchant based on any of the fields: name, businessName, email, or phoneNumber
        const merchant = await Merchant.findOne({
            $or: [
                { name: query },
                { businessName: query },
                { email: query },
                { phoneNumber: query },
            ],
        });

        if (!merchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }

        // Fetch associated account details
        const accountDetails = await AccountDetails.findOne({
            merchantId: merchant.merchantId,
        });

        if (!accountDetails) {
            return res
                .status(404)
                .json({ message: "Account details not found" });
        }

        // Return the merchant's details along with account information
        res.status(200).json({
            name: merchant.name,
            businessName: merchant.businessName,
            phoneNumber: merchant.phoneNumber,
            email: merchant.email,
            businessAddress: merchant.businessAddress,
            merchantId: merchant.merchantId,
            qrCode: merchant.qrCode,
            accountNumber: accountDetails.accountNumber,
        });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
