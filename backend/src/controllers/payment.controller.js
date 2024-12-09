import { createRazorpayOrder } from "../utils/razorpay.js";
import Transaction from "../models/transaction.model.js";
import Merchant from "../models/merchant.model.js";

export const createPayment = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;

        const order = await createRazorpayOrder(amount, currency);

        const transaction = new Transaction({
            merchant: req.merchant._id,
            amount,
            type: "payment",
            razorpayOrderId: order.id,
        });
        await transaction.save();

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature } =
            req.body;

        const transaction = await Transaction.findOne({ razorpayOrderId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        transaction.status = "completed";
        transaction.razorpayPaymentId = razorpayPaymentId;
        await transaction.save();

        await Merchant.findByIdAndUpdate(transaction.merchant, {
            $inc: { accountBalance: transaction.amount },
        });

        res.json({ message: "Payment verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            merchant: req.merchant._id,
        }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
