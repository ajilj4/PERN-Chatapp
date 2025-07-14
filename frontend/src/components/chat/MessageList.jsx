import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, markAsRead } from '../../features/chat/chatThunks';
import Message from './Message';
import { fetchRoomDetails } from '../../features/chat/chatThunks';

export default function MessageList() {
  const dispatch = useDispatch();
  const { currentRoom, messages } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentRoom) return;
    
    // Fetch room details and messages
    dispatch(fetchRoomDetails(currentRoom.id));
    dispatch(fetchMessages(currentRoom.id, { limit: 50 }));
  }, [currentRoom, dispatch]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
    
    // Mark messages as read
    if (currentRoom) {
      const unreadMessages = messages.filter(
        msg => 
          msg.sender_id !== user.id && 
          msg.status.some(s => s.user_id === user.id && s.status === 'sent')
      );
      
      unreadMessages.forEach(msg => {
        dispatch(markAsRead(msg.id));
      });
    }
  }, [messages, currentRoom, user.id, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!currentRoom) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <Message 
              key={message.id} 
              message={message} 
              isCurrentUser={message.sender_id === user.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}