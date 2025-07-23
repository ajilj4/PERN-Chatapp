import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { clearState } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';

export default function Login() {
  const [email, setEmail] = useState('john.doe@example.com'); // Pre-fill with test credentials
  const [password, setPassword] = useState('password123');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status } = useSelector(state => state.auth);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      localStorage.setItem('refreshToken', result.payload.data.refreshToken);
      navigate(from, { replace: true });
    }
  };

  return (
    <FormWrapper title="Login" error={error}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <a 
          href="/forgot-password" 
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>
      <div className="mt-2 text-center">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </div>

      {/* Test Credentials Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Test Credentials:</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <div><strong>User:</strong> john.doe@example.com / password123</div>
          <div><strong>Premium:</strong> jane.smith@example.com / password123</div>
          <div><strong>Admin:</strong> sarah.johnson@example.com / password123</div>
        </div>
      </div>
    </FormWrapper>
  );
}