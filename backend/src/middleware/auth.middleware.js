import jwt from "jsonwebtoken";
import Merchant from "../models/merchant.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const merchant = await Merchant.findById(decoded.id).select(
            "-password"
        );

        if (!merchant) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.merchant = merchant;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};
