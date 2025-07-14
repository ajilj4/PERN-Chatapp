import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../features/auth/authThunks';
import { useLocation, useNavigate } from 'react-router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const result = await dispatch(resetPassword({ email, newPassword: password }));
    
    if (resetPassword.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <FormWrapper title="Reset Password">
      <form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Reset Password</Button>
      </form>
    </FormWrapper>
  );
}