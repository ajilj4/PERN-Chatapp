import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { fetchSubscriptionPlans, createSubscription } from '../../features/subscription/subscriptionThunks';
import { openModal } from '../../features/ui/uiSlice';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Spinner } from '../ui/Loading';
import { isPremiumUser } from '../../utils/authUtils';

export default function SubscriptionPlans() {
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const { plans, loading, currentSubscription } = useSelector(state => state.subscription);
  const { user, role } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleSelectPlan = (plan) => {
    if (plan.id === currentSubscription?.planId) return;
    
    setSelectedPlan(plan);
    dispatch(openModal('paymentMethod'));
  };

  const handleUpgrade = async (planId) => {
    try {
      await dispatch(createSubscription({ planId })).unwrap();
      // Handle success - maybe show success message
    } catch (error) {
      console.error('Failed to create subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const currentPlan = plans.find(plan => plan.id === currentSubscription?.planId);
  const isCurrentlyPremium = isPremiumUser(role);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-gray-600">
          Unlock premium features and enhance your chat experience
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card className="p-6 bg-indigo-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900">
                Current Plan: {currentPlan?.name || 'Unknown'}
              </h3>
              <p className="text-indigo-700">
                Status: {currentSubscription.status}
                {currentSubscription.nextBillingDate && (
                  <span className="ml-2">
                    • Next billing: {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage Subscription
            </Button>
          </div>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentSubscription?.planId;
          const isPopular = plan.name.toLowerCase().includes('pro');
          
          return (
            <Card
              key={plan.id}
              className={`relative p-6 ${
                isCurrentPlan 
                  ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                  : isPopular 
                  ? 'ring-2 ring-purple-500' 
                  : ''
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-indigo-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                <p className="mt-4 text-gray-600">{plan.description}</p>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Limitations (for free plan) */}
              {plan.limitations && plan.limitations.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <XMarkIcon className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5" />
                      <span className="ml-3 text-gray-500 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Button */}
              <div className="mt-8">
                {isCurrentPlan ? (
                  <Button fullWidth disabled>
                    Current Plan
                  </Button>
                ) : plan.price === 0 ? (
                  <Button 
                    fullWidth 
                    variant="outline"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Downgrade to Free
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant={isPopular ? 'primary' : 'outline'}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {isCurrentlyPremium ? 'Switch Plan' : 'Upgrade Now'}
                  </Button>
                )}
              </div>

              {/* Trial Info */}
              {plan.trialDays && !isCurrentPlan && (
                <p className="mt-3 text-center text-sm text-gray-500">
                  {plan.trialDays}-day free trial included
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Can I change my plan anytime?
            </h4>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              What payment methods do you accept?
            </h4>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Is there a free trial?
            </h4>
            <p className="text-gray-600">
              Yes, Pro and Premium plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Can I cancel anytime?
            </h4>
            <p className="text-gray-600">
              Absolutely. You can cancel your subscription at any time with no cancellation fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
