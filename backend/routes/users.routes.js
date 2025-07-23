const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { User, UserSubscription, SubscriptionPlan } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Mock user management controller
const userController = {
  // Get all users with pagination and filters
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 20, search = '', role = 'all', status = 'all' } = req.query;
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions = {};

      if (search) {
        whereConditions[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (role !== 'all') {
        whereConditions.role = role;
      }

      if (status !== 'all') {
        whereConditions.status = status;
      }

      // Get users with their subscriptions
      const { count, rows: users } = await User.findAndCountAll({
        where: whereConditions,
        include: [{
          model: UserSubscription,
          include: [{
            model: SubscriptionPlan,
            attributes: ['name', 'price']
          }],
          where: { status: { [Op.in]: ['active', 'trialing'] } },
          required: false
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      // Transform users data
      const transformedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        isActive: user.is_active || false,
        lastSeen: user.last_seen || user.updatedAt,
        subscription: {
          plan: user.UserSubscriptions?.[0]?.SubscriptionPlan?.name || 'Free'
        },
        createdAt: user.createdAt
      }));

      // Calculate stats
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { is_active: true } });
      const inactiveUsers = await User.count({ where: { is_active: false } });
      const premiumUsers = await User.count({
        include: [{
          model: UserSubscription,
          where: { status: { [Op.in]: ['active', 'trialing'] } },
          required: true
        }]
      });

      const stats = {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        premium: premiumUsers,
        standard: totalUsers - premiumUsers
      };

      res.json({
        success: true,
        data: {
          users: transformedUsers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit)
          },
          stats
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update user role
  updateUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validate role
      const validRoles = ['user', 'pro_user', 'admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      const user = await User.findByPk(userId, {
        include: [{
          model: UserSubscription,
          include: [{
            model: SubscriptionPlan,
            attributes: ['name']
          }],
          where: { status: { [Op.in]: ['active', 'trialing'] } },
          required: false
        }],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user role
      await user.update({ role });

      const transformedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        lastSeen: user.last_seen || user.updatedAt,
        isOnline: user.is_online || false,
        subscription: {
          plan: user.UserSubscriptions?.[0]?.SubscriptionPlan?.name || 'Free'
        }
      };

      res.json({
        success: true,
        data: transformedUser,
        message: 'User role updated successfully'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update user status
  updateUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['active', 'inactive', 'suspended'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status specified'
        });
      }

      const user = await User.findByPk(userId, {
        include: [{
          model: UserSubscription,
          include: [{
            model: SubscriptionPlan,
            attributes: ['name']
          }],
          where: { status: { [Op.in]: ['active', 'trialing'] } },
          required: false
        }],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user status
      await user.update({
        status,
        is_online: status === 'active' ? user.is_online : false
      });

      const transformedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        lastSeen: user.last_seen || user.updatedAt,
        isOnline: user.is_online || false,
        subscription: {
          plan: user.UserSubscriptions?.[0]?.SubscriptionPlan?.name || 'Free'
        }
      };

      res.json({
        success: true,
        data: transformedUser,
        message: 'User status updated successfully'
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Delete user (this will cascade to related records due to foreign key constraints)
      await user.destroy();

      res.json({
        success: true,
        data: { userId: parseInt(userId) },
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        include: [{
          model: UserSubscription,
          include: [{
            model: SubscriptionPlan,
            attributes: ['name', 'price']
          }],
          where: { status: { [Op.in]: ['active', 'trialing'] } },
          required: false
        }],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userProfile = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        status: user.status || 'active',
        lastSeen: user.last_seen || user.updatedAt,
        isOnline: user.is_online || false,
        subscription: {
          plan: user.UserSubscriptions?.[0]?.SubscriptionPlan?.name || 'Free'
        },
        profile: {
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          bio: user.bio || '',
          avatar: user.profile_picture || null
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Routes
router.get('/', authMiddleware, userController.getAllUsers);
router.put('/:userId/role', authMiddleware, userController.updateUserRole);
router.put('/:userId/status', authMiddleware, userController.updateUserStatus);
router.delete('/:userId', authMiddleware, userController.deleteUser);
router.get('/:userId/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
