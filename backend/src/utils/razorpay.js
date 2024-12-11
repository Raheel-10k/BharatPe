import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount, currency = "INR") => {
    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    return razorpayInstance.orders.create(options);
};
