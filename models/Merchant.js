import mongoose from "mongoose";
import bcrypt from "bcrypt";

const merchantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    businessName: { type: String, unique: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    businessAddress: { type: String, required: true },
    merchantId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // New field for storing hashed password
    qrCode: { type: String }, // New field to store QR code as base64 string
});

// Pre-save hook to hash password
merchantSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            this.password = await bcrypt.hash(this.password, salt); // Hash the password
        } catch (err) {
            return next(err);
        }
    }
    next();
});

// Pre-validate hook to generate merchantId if not present
merchantSchema.pre("validate", async function (next) {
    if (!this.merchantId) {
        this.merchantId = Math.floor(100 + Math.random() * 900).toString(); // Generate random merchantId

        const existingMerchant = await mongoose
            .model("Merchant")
            .findOne({ merchantId: this.merchantId });
        if (existingMerchant) {
            return next(
                new Error("Generated merchantId already exists. Retry saving.")
            );
        }
    }
    next();
});

// Method to compare entered password with hashed password
merchantSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Merchant = mongoose.model("Merchant", merchantSchema);
export default Merchant;
