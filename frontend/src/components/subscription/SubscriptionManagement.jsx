import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CreditCardIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import {
  fetchUserSubscription,
  cancelSubscription,
  updateSubscription
} from '../../features/subscription/subscriptionThunks';
import { openModal } from '../../features/ui/uiSlice';
import { addToast } from '../../features/ui/uiSlice';
import Button from '../ui/Button';
import Card, { CardHeader, CardBody } from '../ui/Card';
import { Spinner } from '../ui/Loading';
import { formatDate } from '../../utils/timeUtils';

export default function SubscriptionManagement() {
  const dispatch = useDispatch();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const { 
    currentSubscription, 
    subscriptionHistory, 
    invoices, 
    loading 
  } = useSelector(state => state.subscription);

  useEffect(() => {
    dispatch(fetchUserSubscription());
  }, [dispatch]);

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelSubscription(currentSubscription.id)).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Subscription cancelled successfully'
      }));
      setShowCancelConfirm(false);
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Failed to cancel subscription'
      }));
    }
  };

  const handleChangePlan = () => {
    dispatch(openModal('subscription'));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100';
      case 'trialing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      case 'past_due':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentSubscription) {
    return (
      <Card className="text-center p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Active Subscription
        </h3>
        <p className="text-gray-600 mb-4">
          You're currently on the free plan. Upgrade to unlock premium features.
        </p>
        <Button onClick={handleChangePlan}>
          View Plans
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentSubscription.planName}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 w-24">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentSubscription.status)}`}>
                    {getStatusIcon(currentSubscription.status)}
                    <span className="ml-1 capitalize">{currentSubscription.status}</span>
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 w-24">Price:</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${currentSubscription.amount}/{currentSubscription.interval}
                  </span>
                </div>
                
                {currentSubscription.nextBillingDate && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-24">Next billing:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(currentSubscription.nextBillingDate)}
                    </span>
                  </div>
                )}
                
                {currentSubscription.trialEnd && new Date(currentSubscription.trialEnd) > new Date() && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-24">Trial ends:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(currentSubscription.trialEnd)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                fullWidth
                onClick={handleChangePlan}
              >
                Change Plan
              </Button>
              
              {currentSubscription.status === 'active' && (
                <Button 
                  variant="danger" 
                  fullWidth
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCardIcon className="w-8 h-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  •••• •••• •••• {currentSubscription.paymentMethod?.last4 || '****'}
                </p>
                <p className="text-sm text-gray-500">
                  Expires {currentSubscription.paymentMethod?.expMonth || '**'}/{currentSubscription.paymentMethod?.expYear || '****'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Billing History */}
      {invoices && invoices.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a 
                          href={invoice.invoiceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Cancel Subscription
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
              </p>
              <div className="flex justify-center space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="danger"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
