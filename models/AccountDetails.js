import mongoose from "mongoose";

const accountDetailsSchema = new mongoose.Schema({
    merchantId: { type: String, ref: "Merchant", required: true },
    amount: { type: Number, default: 2000000 },
    accountNumber: { type: String, unique: true },
});

accountDetailsSchema.pre("validate", function (next) {
    // Generate a 12-digit random account number if not provided
    if (!this.accountNumber) {
        this.accountNumber = Math.floor(
            100000000000 + Math.random() * 900000000000
        ).toString();
    }
    next();
});

const AccountDetails = mongoose.model("AccountDetails", accountDetailsSchema);
export default AccountDetails;
