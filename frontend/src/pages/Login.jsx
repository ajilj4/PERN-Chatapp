import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { clearState } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    </FormWrapper>
  );
}