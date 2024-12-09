import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const merchantSchema = new mongoose.Schema(
    {
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        businessType: String,
        gstNumber: String,
        panNumber: String,
        accountBalance: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
merchantSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
merchantSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Merchant", merchantSchema);
