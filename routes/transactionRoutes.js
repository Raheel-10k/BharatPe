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

export default router;
