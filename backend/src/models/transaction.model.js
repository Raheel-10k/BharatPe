import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        merchant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["payment", "refund", "withdrawal"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        razorpayPaymentId: String,
        razorpayOrderId: String,
        description: String,
        metadata: Object,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Transaction", transactionSchema);
