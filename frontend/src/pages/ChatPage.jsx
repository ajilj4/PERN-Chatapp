import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, fetchRooms } from '../features/chat/chatThunks';
import ChatContainer from '../components/chat/ChatContainer';
import { useSocket } from '../context/SocketContext';
import { clearChatState, setUserOnlineStatus } from '../features/chat/chatSlice';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { socket } = useSocket();

  useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchRooms());

    return () => {
      dispatch(clearChatState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('chat:message', (message) => {
      dispatch(addMessage(message));
    });

    // Listen for message updates
    socket.on('message:update', (message) => {
      dispatch(updateMessage(message));
    });

    // Listen for message deletions
    socket.on('message:delete', (messageId) => {
      dispatch(removeMessage(messageId));
    });

    // Listen for user status changes
    socket.on('user:status_change', ({ userId, isOnline }) => {
      dispatch(setUserOnlineStatus({ userId, isOnline }));
    });

    return () => {
      socket.off('chat:message');
      socket.off('message:update');
      socket.off('message:delete');
      socket.off('user:status_change');
    };
  }, [socket, dispatch]);

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatContainer />
    </div>
  );
}