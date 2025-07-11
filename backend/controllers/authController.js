
const authService = require('../services/auth.service');
const {
    registerSchema,
    loginSchema,
    refreshSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyOTPSchema,
    resendOTPSchema
} = require('../validations/auth.validation');

const userRegister = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const user = await authService.register({
            ...req.body,
            profile: req.file
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            data: { user }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Registration failed'
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const deviceInfo = req.get('User-Agent') || 'Unknown Device';
        const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';

        const result = await authService.login({
            ...req.body,
            deviceInfo,
            ip
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Login failed'
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { error } = verifyOTPSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await authService.verifyOTP(req.body);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'OTP verification failed'
        });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { error } = resendOTPSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await authService.resendOTP(req.body);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error('Resend OTP error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Failed to resend OTP'
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { error } = forgotPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await authService.forgotPassword(req.body);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Failed to process forgot password request'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await authService.resetPassword(req.body);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Password reset failed'
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await authService.refreshToken(req.body);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: result
        });
    } catch (err) {
        console.error('Token refresh error:', err);
        res.status(401).json({
            success: false,
            message: err.message || 'Token refresh failed'
        });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers.authorization?.split(' ')[1];
        
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const result = await authService.logout({ refreshToken });

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Logout failed'
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUsers = await authService.getAllUser();
        res.status(200).json({
            success: true,
            data: { users: allUsers }
        });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch users'
        });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authService.getUser(id);
        
        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(404).json({
            success: false,
            message: err.message || 'User not found'
        });
    }
};

module.exports = {
    userRegister,
    userLogin,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
    getAllUser,
    getUser
};