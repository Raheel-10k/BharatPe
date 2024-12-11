import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
    merchantRegisterSchema,
    merchantLoginSchema,
} from "../utils/validation.js";

const router = express.Router();

router.post("/register", validateRequest(merchantRegisterSchema), register);
router.post("/login", validateRequest(merchantLoginSchema), login);

export default router;
