import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSubscriptionPlans,
  createSubscription,
  cancelSubscription,
  updateSubscription,
  fetchUserSubscription
} from './subscriptionThunks';

const initialState = {
  plans: [],
  currentSubscription: null,
  subscriptionHistory: [],
  status: 'idle',
  error: null,
  loading: false,
  paymentMethods: [],
  invoices: []
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionState(state) {
      state.status = 'idle';
      state.error = null;
      state.loading = false;
    },
    
    setCurrentSubscription(state, action) {
      state.currentSubscription = action.payload;
    },
    
    addPaymentMethod(state, action) {
      state.paymentMethods.push(action.payload);
    },
    
    removePaymentMethod(state, action) {
      state.paymentMethods = state.paymentMethods.filter(
        method => method.id !== action.payload
      );
    },
    
    updateSubscriptionStatus(state, action) {
      if (state.currentSubscription) {
        state.currentSubscription.status = action.payload;
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch subscription plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.data;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.data;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel subscription
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload.data;
      })
      
      // Update subscription
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload.data;
      })
      
      // Fetch user subscription
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload.data;
        state.subscriptionHistory = action.payload.history || [];
        state.invoices = action.payload.invoices || [];
      });
  }
});

export const {
  clearSubscriptionState,
  setCurrentSubscription,
  addPaymentMethod,
  removePaymentMethod,
  updateSubscriptionStatus
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
