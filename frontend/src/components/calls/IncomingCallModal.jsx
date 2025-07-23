import { useSelector, useDispatch } from 'react-redux';
import { PhoneIcon, PhoneXMarkIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { acceptCall, rejectCall } from '../../features/calls/callsSlice';
import Modal from '../ui/Modal';

export default function IncomingCallModal() {
  const dispatch = useDispatch();
  const { isIncomingCall, incomingCallData, callType } = useSelector(state => state.calls);

  if (!isIncomingCall || !incomingCallData) return null;

  const handleAccept = () => {
    dispatch(acceptCall(incomingCallData));
  };

  const handleReject = () => {
    dispatch(rejectCall());
  };

  const getCallerName = () => {
    return incomingCallData.callerName || incomingCallData.callerEmail || 'Unknown Caller';
  };

  const getCallTypeText = () => {
    return callType === 'video' ? 'Video Call' : 'Audio Call';
  };

  return (
    <Modal
      isOpen={isIncomingCall}
      onClose={handleReject}
      size="sm"
      className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
    >
      <div className="text-center p-6">
        {/* Caller Avatar */}
        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold">
            {getCallerName().charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Caller Info */}
        <h3 className="text-xl font-semibold mb-1">{getCallerName()}</h3>
        <p className="text-indigo-200 mb-2">Incoming {getCallTypeText()}</p>

        {/* Ringing Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              {callType === 'video' ? (
                <VideoCameraIcon className="w-8 h-8" />
              ) : (
                <PhoneIcon className="w-8 h-8" />
              )}
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8">
          {/* Reject Button */}
          <button
            onClick={handleReject}
            className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
            title="Decline call"
          >
            <PhoneXMarkIcon className="w-8 h-8" />
          </button>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            className="w-16 h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
            title="Accept call"
          >
            <PhoneIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-indigo-200 mt-4 opacity-75">
          Tap to answer or decline
        </p>
      </div>
    </Modal>
  );
}
