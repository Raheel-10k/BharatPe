import mongoose from 'mongoose';

const accountDetailsSchema = new mongoose.Schema({
    merchantId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
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

const AccountDetails = mongoose.model('AccountDetails', accountDetailsSchema);
export default AccountDetails;
