import express from "express";
import Merchant from "../models/Merchant.js";
import AccountDetails from "../models/AccountDetails.js";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";

const router = express.Router();

// Function to generate a unique account number
const generateUniqueAccountNumber = async () => {
    let isUnique = false;
    let accountNumber;

    while (!isUnique) {
        accountNumber = Math.floor(
            100000000000 + Math.random() * 900000000000
        ).toString(); // Generate 12-digit number
        const existingAccount = await AccountDetails.findOne({ accountNumber });
        if (!existingAccount) {
            isUnique = true; // Break the loop if no account with the same number exists
        }
    }

    return accountNumber;
};

// POST: Register Merchant
router.post("/register", async (req, res) => {
    const {
        name,
        businessName,
        phoneNumber,
        email,
        businessAddress,
        password,
    } = req.body;

    try {
        // Check if businessName or email already exists
        const existingMerchant = await Merchant.findOne({
            $or: [{ businessName }, { email }],
        });

        if (existingMerchant) {
            return res
                .status(400)
                .json({ message: "Business name or email already exists" });
        }

        // Create new merchant
        const merchant = new Merchant({
            name,
            businessName,
            phoneNumber,
            email,
            businessAddress,
            password, // Password will be hashed automatically in the pre-save hook
        });

        await merchant.save();

        // Generate a unique account number
        const accountNumber = await generateUniqueAccountNumber();

        // Create account details for the registered merchant
        const accountDetails = new AccountDetails({
            merchantId: merchant.merchantId,
            accountNumber,
        });

        await accountDetails.save();

        // Generate a QR code for the merchant containing the merchantId as base64 string
        const qrCodeData = await QRCode.toDataURL(merchant.merchantId);

        // Store the QR code as base64 string in the merchant document
        merchant.qrCode = qrCodeData;
        await merchant.save();

        res.status(201).json({
            message: "Merchant registered successfully",
            merchantId: merchant.merchantId,
            accountNumber: accountDetails.accountNumber,
            qrCodeUrl: merchant.qrCode, // Provide the base64-encoded QR code in the response
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST: Login Merchant
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find merchant by email
        const merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Validate password
        const isMatch = await merchant.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { merchantId: merchant.merchantId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET: Fetch QR Code by Merchant ID
router.get("/qr/:merchantId", async (req, res) => {
    const { merchantId } = req.params;

    try {
        // Fetch the merchant by merchantId
        const merchant = await Merchant.findOne({ merchantId });
        if (!merchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }

        // If QR code is available as base64
        return res.status(200).json({ qrCode: merchant.qrCode });
    } catch (error) {
        console.error("Error fetching QR code:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// POST: Get all user information by phone number
router.post("/info", async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    try {
        // Find the merchant by phone number
        const merchant = await Merchant.findOne({ phoneNumber });
        if (!merchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }

        // Fetch account details associated with the merchant
        const accountDetails = await AccountDetails.findOne({
            merchantId: merchant.merchantId,
        });

        if (!accountDetails) {
            return res
                .status(404)
                .json({ message: "Account details not found" });
        }

        // Return the user information
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
        console.error("Error fetching user information:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
