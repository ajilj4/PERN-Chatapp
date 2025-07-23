import { useSelector, useDispatch } from 'react-redux';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  InformationCircleIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { initiateCall } from '../../features/calls/callsSlice';
import { openModal } from '../../features/ui/uiSlice';
import RoleBasedComponent from '../auth/RoleBasedComponent';
import { PERMISSIONS } from '../../utils/authUtils';
import { useState } from 'react';

export default function ConversationHeader() {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentRoom } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  if (!currentRoom) return null;

  const isGroupChat = currentRoom.type === 'group';
  const otherParticipant = isGroupChat 
    ? null 
    : currentRoom.members?.find(member => member.user.id !== user?.id);

  const handleAudioCall = () => {
    if (isGroupChat) {
      // For group calls, we might need different logic
      dispatch(initiateCall({
        roomId: currentRoom.id,
        callType: 'audio',
        participants: currentRoom.members.map(m => m.user.id)
      }));
    } else {
      dispatch(initiateCall({
        userId: otherParticipant?.user.id,
        roomId: currentRoom.id,
        callType: 'audio'
      }));
    }
    setShowDropdown(false);
  };

  const handleVideoCall = () => {
    if (isGroupChat) {
      dispatch(initiateCall({
        roomId: currentRoom.id,
        callType: 'video',
        participants: currentRoom.members.map(m => m.user.id)
      }));
    } else {
      dispatch(initiateCall({
        userId: otherParticipant?.user.id,
        roomId: currentRoom.id,
        callType: 'video'
      }));
    }
    setShowDropdown(false);
  };

  const handleShowInfo = () => {
    dispatch(openModal('roomInfo'));
    setShowDropdown(false);
  };

  const getDisplayName = () => {
    if (isGroupChat) {
      return currentRoom.name || 'Group Chat';
    }
    return otherParticipant?.user.username || otherParticipant?.user.email || 'Unknown User';
  };

  const getOnlineStatus = () => {
    if (isGroupChat) {
      const onlineCount = currentRoom.members?.filter(m => m.user.isOnline).length || 0;
      return `${onlineCount} online`;
    }
    return otherParticipant?.user.isOnline ? 'Online' : 'Offline';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left side - User/Group info */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          {isGroupChat ? (
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-indigo-600" />
            </div>
          ) : (
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
              {otherParticipant?.user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900">{getDisplayName()}</h3>
          <p className="text-sm text-gray-500">{getOnlineStatus()}</p>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-2">
        {/* Audio Call Button */}
        <RoleBasedComponent requiredPermission={PERMISSIONS.MAKE_AUDIO_CALL}>
          <button
            onClick={handleAudioCall}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Audio Call"
          >
            <PhoneIcon className="w-5 h-5" />
          </button>
        </RoleBasedComponent>

        {/* Video Call Button */}
        <RoleBasedComponent requiredPermission={PERMISSIONS.MAKE_VIDEO_CALL}>
          <button
            onClick={handleVideoCall}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Video Call"
          >
            <VideoCameraIcon className="w-5 h-5" />
          </button>
        </RoleBasedComponent>

        {/* Info Button */}
        <button
          onClick={handleShowInfo}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title="Conversation Info"
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="More Options"
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={handleShowInfo}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Conversation Info
                </button>
                
                <RoleBasedComponent requiredPermission={PERMISSIONS.DELETE_ROOM}>
                  <button
                    onClick={() => {
                      // Handle delete conversation
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Conversation
                  </button>
                </RoleBasedComponent>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
