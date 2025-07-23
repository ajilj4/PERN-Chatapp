import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../features/chat/chatThunks';
import { useSocket } from '../../context/SocketContext';
import { addToast } from '../../features/ui/uiSlice';

export default function MessageInput() {
  const dispatch = useDispatch();
  const { currentRoom } = useSelector(state => state.chat);
  const { socket } = useSocket();
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;
    if (!currentRoom?.id) return;

    try {
      await dispatch(sendMessage({
        roomId: currentRoom.id,
        content: message,
        type: 'text',
        attachment
      })).unwrap();

      setMessage('');
      setAttachment(null);

      // Clear typing indicator
      if (socket) {
        socket.emit('chat:typing', { roomId: currentRoom.id, isTyping: false });
      }
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit('chat:typing', { roomId: currentRoom.id, isTyping: true });
      setIsTyping(true);
    }
    
    // Reset typing indicator after 3 seconds of inactivity
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('chat:typing', { roomId: currentRoom.id, isTyping: false });
      setIsTyping(false);
    }, 3000);
  };

  return (
    <div className="border-t bg-white p-4">
      {attachment && (
        <div className="mb-2 flex items-center">
          <div className="relative">
            <img 
              src={URL.createObjectURL(attachment)} 
              alt="Preview" 
              className="w-16 h-16 object-cover rounded-md"
            />
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={() => setAttachment(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <span className="ml-2 text-sm text-gray-500">{attachment.name}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center">
        <button 
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={() => fileInputRef.current.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </button>
        
        <div className="flex-1 mx-2">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
          />
        </div>
        
        <button 
          type="submit"
          className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-blue-300"
          disabled={!message.trim() && !attachment}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}