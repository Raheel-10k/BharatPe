import jwt from "jsonwebtoken";
import Merchant from "../models/merchant.model.js";

export const register = async (req, res) => {
    try {
        const merchantExists = await Merchant.findOne({
            email: req.body.email,
        });
        if (merchantExists) {
            return res.status(400).json({ message: "Merchant already exists" });
        }

        const merchant = new Merchant(req.body);
        await merchant.save();

        const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(201).json({
            message: "Merchant registered successfully",
            token,
            merchant: {
                id: merchant._id,
                businessName: merchant.businessName,
                email: merchant.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const merchant = await Merchant.findOne({ email });

        if (!merchant) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await merchant.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.json({
            message: "Login successful",
            token,
            merchant: {
                id: merchant._id,
                businessName: merchant.businessName,
                email: merchant.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
