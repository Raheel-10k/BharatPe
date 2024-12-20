import express from 'express';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import Merchant from '../models/Merchant.js';
import AccountDetails from '../models/AccountDetails.js';

const router = express.Router();

// Register new merchant
router.post('/register', async (req, res) => {
    try {
        const { name, businessName, phoneNumber, email, businessAddress, password } = req.body;

        // Check if merchant already exists
        const existingMerchant = await Merchant.findOne({ 
            $or: [{ email }, { phoneNumber }]
        });
        if (existingMerchant) {
            return res.status(400).json({ 
                message: existingMerchant.email === email 
                    ? 'Email already registered' 
                    : 'Phone number already registered'
            });
        }

        // Create new merchant
        const merchant = new Merchant({
            name,
            businessName,
            phoneNumber,
            email,
            businessAddress,
            password
        });

        await merchant.save();

        // Create account details for the merchant
        const accountDetails = new AccountDetails({
            merchantId: merchant.merchantId,
            phoneNumber: merchant.phoneNumber,
            name: merchant.name,
            amount: 0,
            accountNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString()
        });

        await accountDetails.save();

        // Generate JWT token
        const token = jwt.sign(
            { merchantId: merchant.merchantId },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            phoneNumber: merchant.phoneNumber, 
            merchant: {
                merchantId: merchant.merchantId,
                name: merchant.name,
                phoneNumber: merchant.phoneNumber,
                businessName: merchant.businessName,
                email: merchant.email,
                businessAddress: merchant.businessAddress
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login merchant using email and password
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        // Find merchant by email
        const merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await merchant.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Get account details
        const accountDetails = await AccountDetails.findOne({ merchantId: merchant.merchantId });

        // Generate JWT token
        const token = jwt.sign(
            { merchantId: merchant.merchantId },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            phoneNumber: merchant.phoneNumber, 
            merchant: {
                merchantId: merchant.merchantId,
                name: merchant.name,
                phoneNumber: merchant.phoneNumber,
                businessName: merchant.businessName,
                email: merchant.email,
                businessAddress: merchant.businessAddress,
                accountBalance: accountDetails ? accountDetails.amount : 0
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed: ' + error.message });
    }
});

// Get QR code by merchantId
router.get('/qr/:merchantId', async (req, res) => {
    try {
        const { merchantId } = req.params;
        
        // Find merchant
        const merchant = await Merchant.findOne({ merchantId });
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }

        // Generate QR code
        const qrData = {
            merchantId: merchant.merchantId,
            name: merchant.name,
            businessName: merchant.businessName
        };
        
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
        
        res.json({ qrCode: qrCodeDataUrl });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Failed to generate QR code' });
    }
});

// Get merchant details by phone number
router.get('/merchant-details', async (req, res) => {
    try {
        const { phoneNumber } = req.query;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const merchant = await Merchant.findOne({ phoneNumber });
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }

        const accountDetails = await AccountDetails.findOne({ merchantId: merchant.merchantId });

        res.json({
            merchantId: merchant.merchantId,
            name: merchant.name,
            phoneNumber: merchant.phoneNumber,
            businessName: merchant.businessName,
            email: merchant.email,
            businessAddress: merchant.businessAddress,
            accountBalance: accountDetails ? accountDetails.amount : 0
        });
    } catch (error) {
        console.error('Error fetching merchant details:', error);
        res.status(500).json({ message: 'Failed to fetch merchant details' });
    }
});

// Get merchant profile info
router.post('/info', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        jwt.verify(token, 'your-secret-key', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            const { merchantId } = decoded;

            // Find merchant
            const merchant = await Merchant.findOne({ merchantId });
            if (!merchant) {
                return res.status(404).json({ message: 'Merchant not found' });
            }

            // Get account details
            const accountDetails = await AccountDetails.findOne({ merchantId });

            res.json({
                merchantId: merchant.merchantId,
                name: merchant.name,
                phoneNumber: merchant.phoneNumber,
                businessName: merchant.businessName,
                email: merchant.email,
                businessAddress: merchant.businessAddress,
                accountBalance: accountDetails ? accountDetails.amount : 0
            });
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

export default router;
