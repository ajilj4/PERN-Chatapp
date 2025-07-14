import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../features/auth/authThunks';
import { clearState } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status, message } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearState());
    
    if (location.state) {
      setEmail(location.state.email || '');
      setType(location.state.type || 'email_verification');
    } else {
      navigate('/login');
    }
  }, [dispatch, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyOTP({ email, otp, type }));
    
    if (verifyOTP.fulfilled.match(result)) {
      if (type === 'email_verification') {
        navigate('/login');
      } else if (type === 'password_reset') {
        navigate('/reset-password', { state: { email } });
      }
    }
  };

  return (
    <FormWrapper title="Verify OTP" error={error} message={message}>
      <p className="mb-4 text-gray-600">
        We've sent a 6-digit code to {email}
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          pattern="\d{6}"
          title="6-digit code"
        />
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Verifying...' : 'Verify'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        Didn't receive OTP?{' '}
        <a 
          href="/resend-otp" 
          className="text-blue-600 hover:underline"
          state={{ email, type }}
        >
          Resend
        </a>
      </div>
    </FormWrapper>
  );
}