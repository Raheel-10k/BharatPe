import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const loanSchema = new mongoose.Schema({
    Amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    Duration: {
        type: Number,
        required: true
    },
    EMIperMonth: {
        type: Number,
        required: true
    },
    LoanType: {
        type: String,
        enum: ['preapproved', 'applied'],
        default: 'preapproved'
    },
    PayBack: {
        type: Number,
        required: true
    },
    RemainingAmount: {
        type: Number,
        required: true
    },
    LoanId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate loan details before saving
loanSchema.pre('save', function(next) {
    if (this.isModified('Amount') || this.isModified('interestRate') || this.isModified('Duration')) {
        const monthlyRate = this.interestRate / (12 * 100);
        const duration = this.Duration;
        const amount = this.Amount;

        // Calculate EMI using compound interest formula
        const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, duration) / 
                   (Math.pow(1 + monthlyRate, duration) - 1);
        
        // Calculate total payback
        const totalPayback = emi * duration;

        this.EMIperMonth = Math.round(emi * 100) / 100;
        this.PayBack = Math.round(totalPayback * 100) / 100;
        this.RemainingAmount = Math.round(totalPayback * 100) / 100;
    }
    next();
});

export default mongoose.model('Loan', loanSchema);
