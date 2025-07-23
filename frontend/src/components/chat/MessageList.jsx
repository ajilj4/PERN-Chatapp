import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, fetchRoomDetails } from '../../features/chat/chatThunks';
import Message from './Message';

export default function MessageList() {
  const dispatch = useDispatch();
  const { currentRoom, messages, messagesLoading } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentRoom?.id) return;

    // Fetch messages for the current room
    dispatch(fetchMessages({ roomId: currentRoom.id, params: { limit: 50 } }));
  }, [currentRoom?.id, dispatch]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!currentRoom) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {messagesLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <Message
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}