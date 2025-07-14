// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, fetchAllUsers } from '../features/auth/authThunks';

export default function Dashboard({ socket, onlineUsers }) {
  const dispatch = useDispatch();
  const { user, users } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('userOnline', { userId: user.id });
    }
    
    return () => {
      if (socket && user) {
        socket.emit('userOffline', { userId: user.id });
      }
    };
  }, [socket, user]);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    dispatch(logoutUser({ refreshToken }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="flex items-center mb-4">
            {user?.profile && (
              <img 
                src={user.profile} 
                alt={user.name} 
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
            )}
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Last seen: {new Date(user?.last_seen).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Online Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Online Users</h2>
          <ul>
            {onlineUsers.map(onlineUser => (
              <li key={onlineUser.userId} className="flex items-center py-2 border-b">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                {onlineUser.username}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* All Users */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map(user => (
            <div 
              key={user.id} 
              className="border p-4 rounded-lg flex items-center"
            >
              {user.profile && (
                <img 
                  src={user.profile} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}