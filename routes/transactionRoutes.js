// routes/transactionRoutes.js
import express from 'express';
import Transaction from '../models/Transaction.js';
import AccountDetails from '../models/AccountDetails.js';

const router = express.Router();

// POST: Create Transaction (Send Money)
router.post("/send", async (req, res) => {
    const { fromMerchantId, toMerchantId, amount } = req.body;
    try {
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Check if both merchants have accounts
        const fromAccount = await AccountDetails.findOne({
            merchantId: fromMerchantId,
        });
        const toAccount = await AccountDetails.findOne({
            merchantId: toMerchantId,
        });

        if (!fromAccount || !toAccount) {
            return res
                .status(404)
                .json({ message: "One or both merchants not found" });
        }

        // Check if the sender has sufficient balance
        if (fromAccount.amount < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create transaction
        const transaction = new Transaction({
            from: fromMerchantId,
            to: toMerchantId,
            amount,
            status: "pending",
        });

        await transaction.save();

        // Deduct amount from sender and add to receiver
        fromAccount.amount -= amount;
        toAccount.amount += amount;

        await fromAccount.save();
        await toAccount.save();

        // Update transaction status to sent
        transaction.status = "sent";
        await transaction.save();

        res.json({ message: 'Transaction successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: All Transactions (Made/Received) by User (based on phoneNumber)
router.get("/allTransactions", async (req, res) => {
    const { merchantId } = req.query; // Get merchantId from query parameters

    try {
        // Find account details by merchantId
        const account = await AccountDetails.findOne({ merchantId });
        if (!account) {
            return res
                .status(404)
                .json({ message: "Account not found for this merchantId" });
        }

        // Fetch all transactions related to this account (both sent and received)
        const transactions = await Transaction.find({
            $or: [{ from: account.merchantId }, { to: account.merchantId }],
        });

        if (transactions.length === 0) {
            return res
                .status(200)
                .json({ message: "No transactions found for this user" });
        }

        // Add TransactionType to each transaction
        const enhancedTransactions = transactions.map((transaction) => ({
            ...transaction._doc, // Spread the original transaction fields
            TransactionType:
                transaction.from === account.merchantId ? "sent" : "received",
        }));

        res.json({ transactions: enhancedTransactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/ourTransactions", async (req, res) => {
    const { fromMerchantId, toMerchantId } = req.query; // Get merchant IDs from query parameters

    try {
        if (!fromMerchantId || !toMerchantId) {
            return res.status(400).json({
                message:
                    "Both fromMerchantId and toMerchantId must be provided",
            });
        }

        // Fetch all transactions where both merchant IDs are involved
        const transactions = await Transaction.find({
            $or: [
                { from: fromMerchantId, to: toMerchantId },
                { from: toMerchantId, to: fromMerchantId },
            ],
        });

        if (transactions.length === 0) {
            return res
                .status(200)
                .json({ message: "No transactions found between these users" });
        }

        // Add TransactionType to each transaction
        const enhancedTransactions = transactions.map((transaction) => ({
            ...transaction._doc, // Spread the original transaction fields
            TransactionType:
                transaction.from === fromMerchantId ? "sent" : "received",
        }));

        res.json({ transactions: enhancedTransactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
