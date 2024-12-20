import express from 'express';
import mongoose from 'mongoose';
import LoanData from '../models/loanData.js';
import LoanApplication from '../models/loanApplication.js';
import AccountDetails from '../models/AccountDetails.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Helper function to calculate EMI with compound interest
const calculateLoanDetails = (principal, annualInterestRate, durationMonths) => {
    // Convert annual interest rate to monthly interest rate
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    
    // Calculate EMI using compound interest formula
    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // where P = Principal, r = monthly interest rate, n = number of months
    const EMI = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, durationMonths) 
              / (Math.pow(1 + monthlyInterestRate, durationMonths) - 1);
    
    // Calculate total amount to be paid
    const totalPayback = EMI * durationMonths;
    
    return {
        EMIperMonth: Math.round(EMI),
        TotalPayBack: Math.round(totalPayback)
    };
};

// Create a new loan (admin only)
router.post('/create', async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }
        if (phoneNumber !== '0123456789') {
            return res.status(403).json({ message: 'Not authorized to create loans' });
        }

        const { amount, interestRate, duration } = req.body;

        // Validate input
        if (!amount || !interestRate || !duration) {
            return res.status(400).json({ message: 'Missing required loan details' });
        }

        // Convert to numbers and validate
        const principalAmount = parseFloat(amount);
        const annualInterest = parseFloat(interestRate);
        const durationMonths = parseInt(duration);

        if (isNaN(principalAmount) || isNaN(annualInterest) || isNaN(durationMonths)) {
            return res.status(400).json({ message: 'Invalid loan details format' });
        }

        if (principalAmount <= 0 || annualInterest <= 0 || durationMonths <= 0) {
            return res.status(400).json({ message: 'Loan details must be positive numbers' });
        }

        // Calculate EMI and total payback
        const { EMIperMonth, TotalPayBack } = calculateLoanDetails(
            principalAmount,
            annualInterest,
            durationMonths
        );

        const loanData = new LoanData({
            amount: principalAmount,
            interestRate: annualInterest,
            duration: durationMonths,
            EMIperMonth,
            TotalPayBack,
            createdBy: phoneNumber,
            isActive: true
        });

        await loanData.save();
        res.status(201).json(loanData);
    } catch (error) {
        console.error('Error creating loan:', error);
        res.status(500).json({ message: 'Error creating loan', error: error.message });
    }
});

// Get all available loans
router.get('/', async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }

        // Fetch all active loans
        const loans = await LoanData.find({ isActive: true });
        res.json(loans);
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ message: 'Error fetching loans', error: error.message });
    }
});

// Get all available loans
router.get('/all-loans', authenticateToken, async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }

        const loans = await LoanData.find({ isActive: true });
        res.json(loans);
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get user's loan applications
router.get('/my-applications', authenticateToken, async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }

        const applications = await LoanApplication.find({ 
            userId: phoneNumber,
            merchantId: merchantId
        }).populate('loanId');
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching loan applications:', error);
        res.status(500).json({ message: 'Error fetching loan applications', error: error.message });
    }
});

// Apply for a loan
router.post('/apply', authenticateToken, async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }

        // Check if user already has an approved loan
        const existingApprovedLoan = await LoanApplication.findOne({
            userId: phoneNumber,
            status: 'approved'
        });

        if (existingApprovedLoan) {
            return res.status(400).json({ message: 'You already have an approved loan' });
        }

        const { loanId } = req.body;
        if (!loanId) {
            return res.status(400).json({ message: 'Loan ID is required' });
        }

        // Verify that the loan exists and is active
        const loan = await LoanData.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        if (!loan.isActive) {
            return res.status(400).json({ message: 'This loan is no longer available' });
        }

        // Create new loan application
        const newApplication = new LoanApplication({
            userId: phoneNumber,
            merchantId: merchantId,
            loanId: loanId,
            status: 'pending'
        });

        await newApplication.save();

        // Auto-decline other pending applications
        await LoanApplication.updateMany(
            {
                userId: phoneNumber,
                status: 'pending',
                _id: { $ne: newApplication._id }
            },
            { status: 'declined' }
        );

        // Populate loan details before sending response
        const populatedApplication = await LoanApplication.findById(newApplication._id).populate('loanId');
        res.status(201).json(populatedApplication);
    } catch (error) {
        console.error('Error applying for loan:', error);
        res.status(500).json({ message: 'Error applying for loan', error: error.message });
    }
});

// Get all loan applications (admin only)
router.get('/applications', authenticateToken, async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }

        // Verify admin access
        if (phoneNumber !== '0123456789') {
            return res.status(403).json({ message: 'Not authorized to view loan applications' });
        }

        const applications = await LoanApplication.find()
            .populate('loanId')
            .sort({ createdAt: -1 });
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching all applications:', error);
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
});

// Update loan application status (admin only)
router.put('/applications/:id', authenticateToken, async (req, res) => {
    try {
        const phoneNumber = req.headers['phone-number'];
        const merchantId = req.headers['merchant-id'];
        
        if (!phoneNumber || !merchantId) {
            return res.status(401).json({ message: 'Authentication headers missing' });
        }

        // Verify admin access
        if (phoneNumber !== '0123456789') {
            return res.status(403).json({ message: 'Not authorized to update loan applications' });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const application = await LoanApplication.findById(id).populate('loanId');
        if (!application) {
            return res.status(404).json({ message: 'Loan application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Can only update pending applications' });
        }

        // If approving the loan, update merchant's account balance
        if (status === 'approved') {
            const loanAmount = application.loanId.amount;

            // Find and update merchant's account balance
            const accountDetails = await AccountDetails.findOne({ 
                merchantId: application.merchantId 
            });

            if (!accountDetails) {
                return res.status(404).json({ message: 'Merchant account not found' });
            }

            // Update the account balance
            await AccountDetails.updateOne(
                { merchantId: application.merchantId },
                { $inc: { amount: loanAmount } }
            );

            // Decline other pending applications
            await LoanApplication.updateMany(
                {
                    merchantId: application.merchantId,
                    status: 'pending',
                    _id: { $ne: id }
                },
                { status: 'declined' }
            );
        }

        // Update the application status
        application.status = status;
        await application.save();

        // Fetch the updated application with populated loan details
        const updatedApplication = await LoanApplication.findById(id).populate('loanId');
        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ message: 'Error updating application', error: error.message });
    }
});

export default router;
