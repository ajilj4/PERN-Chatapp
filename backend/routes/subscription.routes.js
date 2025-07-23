const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { SubscriptionPlan, UserSubscription, User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Mock subscription controller functions
const subscriptionController = {
  // Get all subscription plans
  getPlans: async (req, res) => {
    try {
      const plans = await SubscriptionPlan.findAll({
        where: { is_active: true },
        order: [['price', 'ASC']]
      });

      // Transform database data to match frontend expectations
      const transformedPlans = plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: parseFloat(plan.price),
        interval: 'month', // Default to monthly
        description: plan.description || `${plan.name} subscription plan`,
        features: plan.features ? JSON.parse(plan.features) : [],
        limitations: plan.limitations ? JSON.parse(plan.limitations) : [],
        trialDays: plan.trial_days || 0
      }));

      res.json({
        success: true,
        data: transformedPlans
      });
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get user's current subscription
  getCurrentSubscription: async (req, res) => {
    try {
      const userId = req.user.id;

      const subscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          status: { [Op.in]: ['active', 'trialing'] }
        },
        include: [{
          model: SubscriptionPlan,
          attributes: ['name', 'price', 'features']
        }],
        order: [['createdAt', 'DESC']]
      });

      if (!subscription) {
        return res.json({
          success: true,
          data: null,
          history: [],
          invoices: []
        });
      }

      const transformedSubscription = {
        id: subscription.id,
        planId: subscription.plan_id,
        planName: subscription.SubscriptionPlan?.name || 'Unknown Plan',
        status: subscription.status,
        amount: parseFloat(subscription.SubscriptionPlan?.price || 0),
        interval: 'month',
        nextBillingDate: subscription.end_date,
        paymentMethod: subscription.payment_id ? {
          last4: '****', // Would need to fetch from payment provider
          expMonth: '**',
          expYear: '****'
        } : null
      };

      res.json({
        success: true,
        data: transformedSubscription,
        history: [], // Could implement subscription history
        invoices: [] // Could implement invoice history
      });
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create subscription
  createSubscription: async (req, res) => {
    try {
      const { planId, paymentMethodId } = req.body;
      const userId = req.user.id;

      // Check if plan exists
      const plan = await SubscriptionPlan.findByPk(planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Subscription plan not found'
        });
      }

      // Cancel any existing active subscriptions
      await UserSubscription.update(
        { status: 'cancelled' },
        {
          where: {
            user_id: userId,
            status: { [Op.in]: ['active', 'trialing'] }
          }
        }
      );

      // Create new subscription
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Add 1 month

      const subscription = await UserSubscription.create({
        user_id: userId,
        plan_id: planId,
        status: plan.trial_days > 0 ? 'trialing' : 'active',
        start_date: new Date(),
        end_date: endDate,
        payment_id: paymentMethodId || null
      });

      const transformedSubscription = {
        id: subscription.id,
        planId: subscription.plan_id,
        planName: plan.name,
        status: subscription.status,
        amount: parseFloat(plan.price),
        interval: 'month',
        nextBillingDate: subscription.end_date,
        paymentMethod: paymentMethodId ? {
          last4: '4242', // Mock for development
          expMonth: '12',
          expYear: '2025'
        } : null
      };

      res.json({
        success: true,
        data: transformedSubscription,
        message: 'Subscription created successfully'
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Cancel subscription
  cancelSubscription: async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user.id;

      const subscription = await UserSubscription.findOne({
        where: {
          id: subscriptionId,
          user_id: userId
        },
        include: [{
          model: SubscriptionPlan,
          attributes: ['name', 'price']
        }]
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }

      // Update subscription status to cancelled
      await subscription.update({ status: 'cancelled' });

      const transformedSubscription = {
        id: subscription.id,
        planId: subscription.plan_id,
        planName: subscription.SubscriptionPlan?.name || 'Unknown Plan',
        status: 'cancelled',
        amount: 0,
        interval: 'month',
        nextBillingDate: null,
        paymentMethod: null
      };

      res.json({
        success: true,
        data: transformedSubscription,
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create payment intent
  createPaymentIntent: async (req, res) => {
    try {
      const { amount, currency = 'usd' } = req.body;

      // Mock Stripe payment intent
      const paymentIntent = {
        id: 'pi_' + Date.now(),
        clientSecret: 'pi_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9),
        amount,
        currency,
        status: 'requires_payment_method'
      };

      res.json({
        success: true,
        data: paymentIntent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Routes
router.get('/plans', subscriptionController.getPlans);
router.get('/current', authMiddleware, subscriptionController.getCurrentSubscription);
router.post('/create', authMiddleware, subscriptionController.createSubscription);
router.post('/:subscriptionId/cancel', authMiddleware, subscriptionController.cancelSubscription);
router.post('/create-payment-intent', authMiddleware, subscriptionController.createPaymentIntent);

module.exports = router;
