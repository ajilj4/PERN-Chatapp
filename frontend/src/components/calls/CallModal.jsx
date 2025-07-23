import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PhoneIcon,
  PhoneXMarkIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  VideoCameraSlashIcon,
  SpeakerXMarkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  endCall,
  toggleMute,
  toggleVideo,
  toggleSpeaker,
  setCallModalOpen
} from '../../features/calls/callsSlice';
import Modal from '../ui/Modal';
import { formatDuration } from '../../utils/timeUtils';

export default function CallModal() {
  const dispatch = useDispatch();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callStartTimeRef = useRef(null);
  
  const {
    isCallModalOpen,
    currentCall,
    callStatus,
    callType,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    isSpeakerOn,
    participants
  } = useSelector(state => state.calls);

  // Set up local video stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set up remote video stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Track call start time
  useEffect(() => {
    if (callStatus === 'connected' && !callStartTimeRef.current) {
      callStartTimeRef.current = Date.now();
    }
  }, [callStatus]);

  const handleEndCall = () => {
    dispatch(endCall());
  };

  const handleToggleMute = () => {
    dispatch(toggleMute());
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted; // Toggle the current state
      }
    }
  };

  const handleToggleVideo = () => {
    dispatch(toggleVideo());
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled; // Toggle the current state
      }
    }
  };

  const handleToggleSpeaker = () => {
    dispatch(toggleSpeaker());
  };

  const getCallStatusText = () => {
    switch (callStatus) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return callStartTimeRef.current 
          ? formatDuration(Date.now() - callStartTimeRef.current)
          : 'Connected';
      default:
        return '';
    }
  };

  const getParticipantName = () => {
    if (currentCall?.userId) {
      const participant = participants.find(p => p.id === currentCall.userId);
      return participant?.name || participant?.email || 'Unknown User';
    }
    return 'Group Call';
  };

  if (!isCallModalOpen || !currentCall) return null;

  return (
    <Modal
      isOpen={isCallModalOpen}
      onClose={() => dispatch(setCallModalOpen(false))}
      size="lg"
      className="bg-gray-900 text-white"
    >
      <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
        {/* Remote Video */}
        {callType === 'video' && remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Audio Call or No Remote Video */}
        {(callType === 'audio' || !remoteStream) && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
            <div className="text-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">
                  {getParticipantName().charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{getParticipantName()}</h3>
              <p className="text-indigo-200 mt-1">{getCallStatusText()}</p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        {callType === 'video' && localStream && (
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Call Status Overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
          <span className="text-sm">{getCallStatusText()}</span>
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4">
            {/* Mute Button */}
            <button
              onClick={handleToggleMute}
              className={`p-3 rounded-full transition-colors duration-200 ${
                isMuted 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <div className="relative">
                  <MicrophoneIcon className="w-6 h-6" />
                  <XMarkIcon className="w-4 h-4 absolute -top-1 -right-1 text-red-400" />
                </div>
              ) : (
                <MicrophoneIcon className="w-6 h-6" />
              )}
            </button>

            {/* Video Toggle (only for video calls) */}
            {callType === 'video' && (
              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  !isVideoEnabled 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? (
                  <VideoCameraIcon className="w-6 h-6" />
                ) : (
                  <VideoCameraSlashIcon className="w-6 h-6" />
                )}
              </button>
            )}

            {/* Speaker Toggle */}
            <button
              onClick={handleToggleSpeaker}
              className={`p-3 rounded-full transition-colors duration-200 ${
                isSpeakerOn 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
            >
              {isSpeakerOn ? (
                <SpeakerWaveIcon className="w-6 h-6" />
              ) : (
                <SpeakerXMarkIcon className="w-6 h-6" />
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors duration-200"
              title="End call"
            >
              <PhoneXMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
