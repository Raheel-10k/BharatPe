import Loan from "../models/loan.model.js";

export const applyForLoan = async (req, res) => {
    try {
        const loan = new Loan({
            ...req.body,
            merchant: req.merchant._id,
            status: "pending",
        });

        // Calculate EMI and total payable amount
        const principal = loan.amount;
        const ratePerMonth = loan.interestRate / (12 * 100);
        const tenure = loan.tenure;

        const emi =
            (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure)) /
            (Math.pow(1 + ratePerMonth, tenure) - 1);

        loan.emiAmount = Math.round(emi);
        loan.totalPayable = Math.round(emi * tenure);

        await loan.save();

        res.status(201).json({
            message: "Loan application submitted successfully",
            loan,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ merchant: req.merchant._id }).sort({
            createdAt: -1,
        });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoanDetails = async (req, res) => {
    try {
        const loan = await Loan.findOne({
            _id: req.params.id,
            merchant: req.merchant._id,
        });

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
