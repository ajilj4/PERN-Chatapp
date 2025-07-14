// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
}