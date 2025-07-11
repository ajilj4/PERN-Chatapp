const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50)
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const refreshSchema = Joi.object({
    refreshToken: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    type: Joi.string().valid('email_verification', 'password_reset', 'login').required()
});

const resendOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().valid('email_verification', 'password_reset', 'login').required()
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyOTPSchema,
    resendOTPSchema
};
