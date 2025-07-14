import { createContext, useContext, useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  console.log(socket)
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const newSocket = socketIOClient(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: accessToken },
      autoConnect: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('onlineUsers', users => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};