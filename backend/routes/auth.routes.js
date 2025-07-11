const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../middlewares/multer.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', upload.single('profile'), authController.userRegister);
router.post('/login', authController.userLogin);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/all-users', authMiddleware, authController.getAllUser);
router.get('/user/:id', authMiddleware, authController.getUser);

module.exports = router;