import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { removeToast } from '../../features/ui/uiSlice';
import clsx from 'clsx';

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400'
};

function ToastItem({ toast }) {
  const dispatch = useDispatch();
  const Icon = toastIcons[toast.type] || InformationCircleIcon;

  useEffect(() => {
    if (toast.autoClose !== false) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.autoClose, toast.duration, dispatch]);

  const handleClose = () => {
    dispatch(removeToast(toast.id));
  };

  return (
    <div
      className={clsx(
        'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
        'transform transition-all duration-300 ease-in-out',
        'translate-x-0 opacity-100'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={clsx('h-6 w-6', iconStyles[toast.type])} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {toast.title && (
              <p className="text-sm font-medium text-gray-900">
                {toast.title}
              </p>
            )}
            <p className={clsx('text-sm', toast.title ? 'text-gray-500' : 'text-gray-900')}>
              {toast.message}
            </p>
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useSelector(state => state.ui);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
}

// Toast utility functions
export const toast = {
  success: (message, options = {}) => ({
    type: 'success',
    message,
    ...options
  }),
  
  error: (message, options = {}) => ({
    type: 'error',
    message,
    ...options
  }),
  
  warning: (message, options = {}) => ({
    type: 'warning',
    message,
    ...options
  }),
  
  info: (message, options = {}) => ({
    type: 'info',
    message,
    ...options
  })
};

// Simple toast component for inline use
export function Toast({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className,
  ...props 
}) {
  const Icon = toastIcons[type] || InformationCircleIcon;

  return (
    <div
      className={clsx(
        'rounded-md p-4 border',
        toastStyles[type],
        className
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx('h-5 w-5', iconStyles[type])} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          <div className={clsx('text-sm', title && 'mt-2')}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  type === 'success' && 'text-green-500 hover:bg-green-100 focus:ring-green-600',
                  type === 'error' && 'text-red-500 hover:bg-red-100 focus:ring-red-600',
                  type === 'warning' && 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                  type === 'info' && 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                )}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
