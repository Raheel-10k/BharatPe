import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const merchantSchema = new mongoose.Schema({
    merchantId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    businessName: String,
    businessAddress: String,
    qrCode: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
merchantSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Compare password method
merchantSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Pre-validate hook to generate merchantId if not present
merchantSchema.pre('validate', async function(next) {
    if (!this.merchantId) {
        this.merchantId = Math.floor(100000 + Math.random() * 900000).toString();
        const existingMerchant = await mongoose.model('Merchant').findOne({ merchantId: this.merchantId });
        if (existingMerchant) {
            return next(new Error('Generated merchantId already exists. Please try again.'));
        }
    }
    next();
});

const Merchant = mongoose.model('Merchant', merchantSchema);
export default Merchant;
