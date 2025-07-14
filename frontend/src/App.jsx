// src/App.jsx
import { Routes, Route, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// import ResendOTP from './pages/ResendOTP';
import VerifyOTP from './pages/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute';
import { useSocket } from './context/SocketContext';
import ChatPage from './pages/ChatPage';


function App() {
  const { user } = useSelector(state => state.auth);
  const { socket, onlineUsers } = useSocket();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={
          <ProtectedRoute requireAuth={false}>
            <ResetPassword />
          </ProtectedRoute>
        } />
        {/* <Route path="/resend-otp" element={
          <ProtectedRoute requireAuth={false}>
            <ResendOTP />
          </ProtectedRoute>
        } /> */}
        <Route path="/verify-otp" element={
          <ProtectedRoute requireAuth={false}>
            <VerifyOTP />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <ChatPage socket={socket} onlineUsers={onlineUsers} />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;