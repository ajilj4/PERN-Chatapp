import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { createPaymentIntent, createSubscription } from '../../features/subscription/subscriptionThunks';
import { closeModal } from '../../features/ui/uiSlice';
import { addToast } from '../../features/ui/uiSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Spinner } from '../ui/Loading';

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm({ selectedPlan, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent
      const { data: paymentIntentData } = await dispatch(createPaymentIntent({
        amount: selectedPlan.price * 100, // Convert to cents
        currency: 'usd'
      })).unwrap();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // Add billing details if needed
            },
          }
        }
      );

      if (error) {
        setCardError(error.message);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Create subscription
        await dispatch(createSubscription({
          planId: selectedPlan.id,
          paymentMethodId: paymentIntent.payment_method
        })).unwrap();

        onSuccess();
        dispatch(addToast({
          type: 'success',
          message: 'Subscription created successfully!'
        }));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setCardError(error.message || 'An error occurred during payment');
      onError(error.message || 'An error occurred during payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900">{selectedPlan.name}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          ${selectedPlan.price}
          <span className="text-base font-normal text-gray-600">
            /{selectedPlan.interval}
          </span>
        </p>
        {selectedPlan.trialDays && (
          <p className="text-sm text-green-600 mt-1">
            {selectedPlan.trialDays}-day free trial included
          </p>
        )}
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCardIcon className="w-4 h-4 inline mr-1" />
          Card Information
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-600">{cardError}</p>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center text-sm text-gray-500">
        <LockClosedIcon className="w-4 h-4 mr-2" />
        Your payment information is secure and encrypted
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        disabled={!stripe || processing}
        loading={processing}
      >
        {processing ? 'Processing...' : `Subscribe to ${selectedPlan.name}`}
      </Button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By subscribing, you agree to our{' '}
        <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}

export default function PaymentMethodModal() {
  const dispatch = useDispatch();
  const { modals } = useSelector(state => state.ui);
  const { plans } = useSelector(state => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const isOpen = modals.paymentMethod;

  useEffect(() => {
    // Get selected plan from localStorage or state
    const planId = localStorage.getItem('selectedPlanId');
    if (planId && plans.length > 0) {
      const plan = plans.find(p => p.id === planId);
      setSelectedPlan(plan);
    }
  }, [plans]);

  const handleClose = () => {
    dispatch(closeModal('paymentMethod'));
    localStorage.removeItem('selectedPlanId');
  };

  const handleSuccess = () => {
    handleClose();
    // Redirect to success page or show success message
  };

  const handleError = (error) => {
    dispatch(addToast({
      type: 'error',
      message: error
    }));
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Complete Your Subscription"
      size="md"
    >
      <Elements stripe={stripePromise}>
        <PaymentForm
          selectedPlan={selectedPlan}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Elements>
    </Modal>
  );
}
