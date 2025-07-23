import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { addToast } from '../../features/ui/uiSlice';
import { formatTime } from '../../utils/timeUtils';

export default function Message({ message, isCurrentUser }) {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);



  const canEdit = isCurrentUser;
  const canDelete = isCurrentUser;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      // For now, show a toast that this feature is coming soon
      dispatch(addToast({
        type: 'info',
        message: 'Message deletion feature is coming soon!'
      }));
      setShowOptions(false);
    }
  };

  const handleEdit = () => {
    // For now, show a toast that this feature is coming soon
    dispatch(addToast({
      type: 'info',
      message: 'Message editing feature is coming soon!'
    }));
    setShowEditModal(false);
    setShowOptions(false);
  };

  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <div className="mr-2">
          <Avatar
            src={message.sender?.profile}
            name={message.sender?.name || message.sender?.username}
            size="sm"
          />
        </div>
      )}
      
      <div className={`max-w-xs md:max-w-md lg:max-w-lg relative ${isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} rounded-2xl px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200`}>
        {message.replyToMessage && (
          <div className="border-l-4 border-gray-300 pl-2 mb-2 text-sm text-gray-500">
            <div className="font-medium">
              {message.replyToMessage.sender.id === message.sender.id 
                ? 'You' 
                : message.replyToMessage.sender.name}
            </div>
            <div className="truncate">{message.replyToMessage.content}</div>
          </div>
        )}
        
        {message.attachment ? (
          <div className="mb-2">
            <img 
              src={message.attachment.file_url} 
              alt="Attachment" 
              className="rounded-lg max-w-full max-h-64 object-cover"
            />
          </div>
        ) : null}
        
        <div className="break-words">{message.content}</div>
        
        <div className={`flex justify-between items-center mt-1 text-xs ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
          <span>{formatTime(message.createdAt || message.created_at)}</span>
          <div className="flex items-center space-x-1">
            {message.is_edited && <span>(edited)</span>}
            {isCurrentUser && message.status && (
              <div className="flex items-center">
                {message.status.find(s => s.user_id === message.sender_id)?.status === 'read' ? (
                  <CheckCircleIcon className="w-4 h-4 text-indigo-200" />
                ) : (
                  <CheckIcon className="w-4 h-4 text-indigo-200" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {isCurrentUser && (canEdit || canDelete) && (
          <button
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-200"
            onClick={() => setShowOptions(!showOptions)}
          >
            <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
          </button>
        )}
        
        {/* Message Options */}
        {showOptions && (
          <div className="absolute top-0 right-0 mt-8 bg-white shadow-lg rounded-lg z-10 w-40 border border-gray-200">
            <div className="py-1">
              {canEdit && (
                <button
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    setEditedContent(message.content);
                    setShowEditModal(true);
                    setShowOptions(false);
                  }}
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={handleDelete}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Message Modal */}
      <Modal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Message"
      >
        <textarea
          className="w-full px-3 py-2 border rounded-lg mb-4"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={4}
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 border rounded-lg mr-2"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleEdit}
            disabled={!editedContent.trim()}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}