import Merchant from "../models/merchant.model.js";

export const getMerchantProfile = async (req, res) => {
    try {
        const merchant = await Merchant.findById(req.merchant._id).select(
            "-password"
        );
        res.json(merchant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMerchantProfile = async (req, res) => {
    try {
        const updatableFields = [
            "businessName",
            "ownerName",
            "phone",
            "address",
            "businessType",
            "gstNumber",
            "panNumber",
        ];

        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (updatableFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const merchant = await Merchant.findByIdAndUpdate(
            req.merchant._id,
            { $set: updates },
            { new: true }
        ).select("-password");

        res.json({
            message: "Profile updated successfully",
            merchant,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMerchantBalance = async (req, res) => {
    try {
        const merchant = await Merchant.findById(req.merchant._id).select(
            "accountBalance"
        );
        res.json({ balance: merchant.accountBalance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
