// routes/transactionRoutes.js
import express from "express";
import Transaction from "../models/Transaction.js";
import AccountDetails from "../models/AccountDetails.js";

const router = express.Router();

// POST: Create Transaction (Send Money)
router.post("/send", async (req, res) => {
    const { fromMerchantId, toMerchantId, amount } = req.body;
    try {
        // Check if both merchants have accounts
        const fromAccount = await AccountDetails.findOne({
            merchantId: fromMerchantId,
        });
        const toAccount = await AccountDetails.findOne({
            merchantId: toMerchantId,
        });

        if (!fromAccount || !toAccount) {
            return res
                .status(400)
                .json({ message: "Both merchants must have account details" });
        }

        // Check if the sender has sufficient balance
        if (fromAccount.amount < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
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

        res.status(200).json({
            message: "Transaction successful",
            transaction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET: All Transactions (Made/Received) by User (based on phoneNumber)
router.get("/allTransactions", async (req, res) => {
    const { merchantId } = req.query; // Get merchantId from query parameters
    //console.log("This", merchantId);

    try {
        // Find account details by merchantId
        const account = await AccountDetails.findOne({ merchantId });
        if (!account) {
            return res
                .status(400)
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

        res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
