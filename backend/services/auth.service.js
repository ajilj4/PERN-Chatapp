const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DeviceSession = require('../models/DeviceSession');
const OTP = require('../models/OTP');
const PasswordReset = require('../models/PasswordRest');
const { uploadToS3Dynamic } = require('./s3Upload.service');
const emailService = require('../config/email');
const { generateOTP, generateResetToken, hashToken } = require('../utils/crypto');
const { Op } = require('sequelize');

const register = async ({ email, name, password, phone, username, profile }) => {
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { phone }, { username }]
        }
    });

    if (existingUser) {
        if (existingUser.email === email) throw new Error('Email already exists');
        if (existingUser.phone === phone) throw new Error('Phone number already exists');
        if (existingUser.username === username) throw new Error('Username already exists');
    }

    let profileUrl;
    if (profile) {
        try {
            const uploadResult = await uploadToS3Dynamic(profile, {
                folder: 'users',
                entityId: 'profile',
            });
            profileUrl = uploadResult.url;
        } catch (uploadError) {
            console.error('Failed to upload profile image:', uploadError);
            throw new Error('Profile image upload failed: ' + uploadError.message);
        }
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
        email,
        password: hashPassword,
        name,
        phone,
        username,
        profile: profileUrl,
        is_verified: false
    });

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
        user_id: newUser.id,
        otp_code: otp,
        type: 'email_verification',
        expires_at: otpExpiresAt
    });

    // Send verification email
    try {
        await emailService.sendOTPEmail(email, otp, name);
    } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't throw error here, user is still created
    }

    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;
    
    return userResponse;
};

const login = async ({ email, password, deviceInfo, ip }) => {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    if (!user.is_verified) {
        // Generate and send OTP for unverified users
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await OTP.create({
            user_id: user.id,
            otp_code: otp,
            type: 'email_verification',
            expires_at: otpExpiresAt
        });

        try {
            await emailService.sendOTPEmail(email, otp, user.name);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
        }

        throw new Error('Please verify your email first. OTP sent to your email.');
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save device session
    await DeviceSession.create({
        user_id: user.id,
        device_info: deviceInfo,
        ip: ip,
        refresh_token: refreshToken
    });

    // Update last seen
    await user.update({ last_seen: new Date(), is_active: true });

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    return {
        user: userResponse,
        accessToken,
        refreshToken
    };
};

const verifyOTP = async ({ email, otp, type }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const otpRecord = await OTP.findOne({
        where: {
            user_id: user.id,
            otp_code: otp,
            type: type,
            is_used: false,
            expires_at: { [Op.gt]: new Date() }
        }
    });

    if (!otpRecord) {
        throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as used
    await otpRecord.update({ is_used: true });

    // If email verification, update user
    if (type === 'email_verification') {
        await user.update({ is_verified: true });
        
        // Send welcome email
        try {
            await emailService.sendWelcomeEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }
    }

    return { message: 'OTP verified successfully' };
};

const resendOTP = async ({ email, type }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    // Check if there's a recent OTP
    const recentOTP = await OTP.findOne({
        where: {
            user_id: user.id,
            type: type,
            createdAt: { [Op.gt]: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes
        }
    });

    if (recentOTP) {
        throw new Error('Please wait 2 minutes before requesting another OTP');
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({
        user_id: user.id,
        otp_code: otp,
        type: type,
        expires_at: otpExpiresAt
    });

    try {
        await emailService.sendOTPEmail(email, otp, user.name);
    } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        throw new Error('Failed to send OTP email');
    }

    return { message: 'OTP sent successfully' };
};

const forgotPassword = async ({ email }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordReset.create({
        user_id: user.id,
        token: hashedToken,
        expires_at: expiresAt
    });

    try {
        await emailService.sendPasswordResetEmail(email, resetToken, user.name);
    } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
        throw new Error('Failed to send reset email');
    }

    return { message: 'Password reset email sent successfully' };
};

const resetPassword = async ({ token, newPassword }) => {
    const hashedToken = hashToken(token);
    
    const resetRecord = await PasswordReset.findOne({
        where: {
            token: hashedToken,
            is_used: false,
            expires_at: { [Op.gt]: new Date() }
        }
    });

    if (!resetRecord) {
        throw new Error('Invalid or expired reset token');
    }

    const user = await User.findByPk(resetRecord.user_id);
    if (!user) {
        throw new Error('User not found');
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashPassword });

    // Mark reset token as used
    await resetRecord.update({ is_used: true });

    // Invalidate all device sessions
    await DeviceSession.update(
        { is_active: false },
        { where: { user_id: user.id } }
    );

    return { message: 'Password reset successfully' };
};

const refreshToken = async ({ refreshToken }) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        const deviceSession = await DeviceSession.findOne({
            where: {
                user_id: decoded.userId,
                refresh_token: refreshToken,
                is_active: true
            }
        });

        if (!deviceSession) {
            throw new Error('Invalid refresh token');
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const payload = { userId: user.id, email: user.email };
        const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Update device session with new refresh token
        await deviceSession.update({ refresh_token: newRefreshToken });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

const logout = async ({ refreshToken }) => {
    await DeviceSession.update(
        { is_active: false },
        { where: { refresh_token: refreshToken } }
    );

    return { message: 'Logged out successfully' };
};

const getAllUser = async () => {
    const allUsers = await User.findAll({
        attributes: { exclude: ['password'] },
        paranoid: false
    });
    return allUsers;
};

const getUser = async (id) => {
    const user = await User.findOne({
        where: { id },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.deletedAt) {
        throw new Error('User deleted');
    }

    return user;
};

module.exports = {
    register,
    login,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
    getAllUser,
    getUser
};