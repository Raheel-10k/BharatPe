import Joi from "joi";

export const merchantRegisterSchema = Joi.object({
    businessName: Joi.string().required(),
    ownerName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        pincode: Joi.string(),
    }),
    businessType: Joi.string(),
    gstNumber: Joi.string(),
    panNumber: Joi.string(),
});

export const merchantLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const loanApplicationSchema = Joi.object({
    amount: Joi.number().positive().required(),
    interestRate: Joi.number().positive().required(),
    tenure: Joi.number().positive().required(),
    purpose: Joi.string().required(),
});
