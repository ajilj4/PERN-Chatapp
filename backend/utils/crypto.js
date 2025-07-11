const crypto = require('crypto');

const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    
    return otp;
};

const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
    generateOTP,
    generateResetToken,
    hashToken
};