import mongoose from 'mongoose';

const loanDataSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    EMIperMonth: {
        type: Number,
        required: true
    },
    TotalPayBack: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LoanData = mongoose.model('LoanData', loanDataSchema);
export default LoanData;
