import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../features/auth/authThunks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';
import { useNavigate } from 'react-router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword({ email }));
    
    if (forgotPassword.fulfilled.match(result)) {
      navigate('/verify-otp', { 
        state: { 
          email,
          type: 'password_reset'
        } 
      });
    }
  };

  return (
    <FormWrapper title="Forgot Password">
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <p className="mb-4 text-gray-600 text-sm">
          Enter your email and we'll send you instructions to reset your password
        </p>
        <Button type="submit">Send Reset Instructions</Button>
      </form>
      <div className="mt-4 text-center">
        <a href="/login" className="text-blue-600 hover:underline">
          Back to Login
        </a>
      </div>
    </FormWrapper>
  );
}