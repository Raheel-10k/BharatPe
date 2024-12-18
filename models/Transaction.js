import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    to: { type: String, ref: "Merchant", required: true },
    from: { type: String, ref: "Merchant", required: true },
    status: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
    },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
