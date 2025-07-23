import { createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionService from '../../api/subscriptionService';

// Fetch available subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

// Create a new subscription
export const createSubscription = createAsyncThunk(
  'subscription/create',
  async ({ planId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.createSubscription({
        planId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subscription');
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/subscription/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

// Update subscription
export const updateSubscription = createAsyncThunk(
  'subscription/update',
  async ({ subscriptionId, planId }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/subscription/${subscriptionId}`, {
        planId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subscription');
    }
  }
);

// Fetch user's current subscription
export const fetchUserSubscription = createAsyncThunk(
  'subscription/fetchUserSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getCurrentSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

// Create payment intent for Stripe
export const createPaymentIntent = createAsyncThunk(
  'subscription/createPaymentIntent',
  async ({ amount, currency = 'usd' }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/subscription/create-payment-intent', {
        amount,
        currency
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
    }
  }
);

// Add payment method
export const addPaymentMethod = createAsyncThunk(
  'subscription/addPaymentMethod',
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/subscription/payment-methods', paymentMethodData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add payment method');
    }
  }
);

// Remove payment method
export const removePaymentMethod = createAsyncThunk(
  'subscription/removePaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`/subscription/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove payment method');
    }
  }
);
