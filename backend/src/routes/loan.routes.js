import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { loanApplicationSchema } from "../utils/validation.js";
import {
    applyForLoan,
    getLoans,
    getLoanDetails,
} from "../controllers/loan.controller.js";

const router = express.Router();

router.use(protect);

router.post("/apply", validateRequest(loanApplicationSchema), applyForLoan);
router.get("/", getLoans);
router.get("/:id", getLoanDetails);

export default router;
