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

// Get account details by phone number
router.get('/details-by-phone', async (req, res) => {
    try {
        const { phoneNumber } = req.query;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // First find the merchant
        const merchant = await Merchant.findOne({ phoneNumber });
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }

        // Then get their account details using merchantId
        const accountDetails = await AccountDetails.findOne({ merchantId: merchant.merchantId });
        if (!accountDetails) {
            // If no account details exist, create them
            const newAccountDetails = new AccountDetails({
                merchantId: merchant.merchantId,
                phoneNumber: merchant.phoneNumber,
                name: merchant.name,
                amount: 0,
                accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString()
            });
            await newAccountDetails.save();
            
            // Return the newly created account details
            return res.json({
                merchantId: merchant.merchantId,
                name: merchant.name,
                accountBalance: 0,
                businessName: merchant.businessName,
                email: merchant.email,
                businessAddress: merchant.businessAddress,
                phoneNumber: merchant.phoneNumber
            });
        }

        res.json({
            merchantId: merchant.merchantId,
            name: merchant.name,
            accountBalance: accountDetails.amount,
            businessName: merchant.businessName,
            email: merchant.email,
            businessAddress: merchant.businessAddress,
            phoneNumber: merchant.phoneNumber
        });
    } catch (error) {
        console.error('Error fetching account details:', error);
        res.status(500).json({ message: 'Failed to fetch account details' });
    }
});

// Search merchants by name or phone
router.post("/search", async (req, res) => {
    const { query } = req.body;
    try {
        const merchants = await Merchant.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { phoneNumber: { $regex: query, $options: "i" } },
            ],
        });

        const merchantsWithDetails = await Promise.all(
            merchants.map(async (merchant) => {
                const accountDetails = await AccountDetails.findOne({
                    merchantId: merchant.merchantId
                });
                return {
                    ...merchant.toObject(),
                    accountBalance: accountDetails ? accountDetails.amount : 0,
                };
            })
        );

        res.json(merchantsWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error searching merchants" });
    }
});

export default router;
