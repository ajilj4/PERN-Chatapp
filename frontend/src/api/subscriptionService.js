import axiosClient from './axiosClient';

const BASE = '/subscription';

export default {
  // Get all available subscription plans
  getPlans() {
    return axiosClient.get(`${BASE}/plans`);
  },

  // Get current user's subscription
  getCurrentSubscription() {
    return axiosClient.get(`${BASE}/current`);
  },

  // Create a new subscription
  createSubscription(data) {
    return axiosClient.post(`${BASE}/create`, data);
  },

  // Update subscription
  updateSubscription(subscriptionId, data) {
    return axiosClient.put(`${BASE}/${subscriptionId}`, data);
  },

  // Cancel subscription
  cancelSubscription(subscriptionId) {
    return axiosClient.post(`${BASE}/${subscriptionId}/cancel`);
  },

  // Resume subscription
  resumeSubscription(subscriptionId) {
    return axiosClient.post(`${BASE}/${subscriptionId}/resume`);
  },

  // Get subscription history
  getSubscriptionHistory() {
    return axiosClient.get(`${BASE}/history`);
  },

  // Get invoices
  getInvoices() {
    return axiosClient.get(`${BASE}/invoices`);
  },

  // Create payment method
  createPaymentMethod(data) {
    return axiosClient.post(`${BASE}/payment-methods`, data);
  },

  // Get payment methods
  getPaymentMethods() {
    return axiosClient.get(`${BASE}/payment-methods`);
  },

  // Delete payment method
  deletePaymentMethod(paymentMethodId) {
    return axiosClient.delete(`${BASE}/payment-methods/${paymentMethodId}`);
  },

  // Set default payment method
  setDefaultPaymentMethod(paymentMethodId) {
    return axiosClient.post(`${BASE}/payment-methods/${paymentMethodId}/default`);
  }
};
