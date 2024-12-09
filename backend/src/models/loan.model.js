import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
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
        interestRate: {
            type: Number,
            required: true,
        },
        tenure: {
            type: Number,
            required: true, // in months
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "active", "closed"],
            default: "pending",
        },
        purpose: String,
        documents: [
            {
                type: String,
                url: String,
            },
        ],
        emiAmount: Number,
        totalPayable: Number,
        paidAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Loan", loanSchema);
