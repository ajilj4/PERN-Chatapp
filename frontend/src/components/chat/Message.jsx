import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { deleteExistingMessage, updateExistingMessage } from '../../features/chat/chatThunks';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';

export default function Message({ message, isCurrentUser }) {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch(deleteExistingMessage(message.id));
      setShowOptions(false);
    }
  };

  const handleEdit = () => {
    dispatch(updateExistingMessage(message.id, editedContent));
    setShowEditModal(false);
    setShowOptions(false);
  };

  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <div className="mr-2">
          <Avatar src={message.sender.profile} size="sm" />
        </div>
      )}
      
      <div className={`max-w-xs md:max-w-md lg:max-w-lg relative ${isCurrentUser ? 'bg-blue-100' : 'bg-white'} rounded-2xl px-4 py-2 shadow`}>
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
        
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{format(new Date(message.createdAt), 'h:mm a')}</span>
          {message.is_edited && <span>(edited)</span>}
          {isCurrentUser && message.status && (
            <span>
              {message.status.find(s => s.user_id === message.sender_id)?.status === 'read' 
                ? 'Seen' 
                : 'Sent'}
            </span>
          )}
        </div>
        
        {isCurrentUser && (
          <button 
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
            onClick={() => setShowOptions(!showOptions)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        )}
        
        {/* Message Options */}
        {showOptions && (
          <div className="absolute top-0 right-0 mt-8 bg-white shadow-lg rounded-lg z-10 w-32">
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setEditedContent(message.content);
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
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