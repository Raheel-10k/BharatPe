import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    merchantId: {
        type: String,
        required: true
    },
    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanData',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    declineReason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);
export default LoanApplication;
