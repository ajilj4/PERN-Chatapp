// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTP from './pages/VerifyOTP';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import ChatContainer from './components/chat/ChatContainer';
import UserManagement from './components/admin/UserManagement';
import SubscriptionPlans from './components/subscription/SubscriptionPlans';
import SubscriptionManagement from './components/subscription/SubscriptionManagement';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { PERMISSIONS } from './utils/authUtils';


function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Routes>
        {/* Public Routes */}
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
        <Route path="/verify-otp" element={
          <ProtectedRoute requireAuth={false}>
            <VerifyOTP />
          </ProtectedRoute>
        } />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<ChatContainer />} />
          <Route path="subscription" element={<SubscriptionPlans />} />
          <Route path="subscription/manage" element={<SubscriptionManagement />} />

          {/* Admin Routes */}
          <Route path="admin/users" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
              <UserManagement />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;