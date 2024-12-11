import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getMerchantProfile,
    updateMerchantProfile,
    getMerchantBalance,
} from "../controllers/merchant.controller.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getMerchantProfile);
router.put("/profile", updateMerchantProfile);
router.get("/balance", getMerchantBalance);

export default router;
