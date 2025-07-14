import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authThunks';
import { clearState } from '../features/auth/authSlice';
import { useNavigate } from 'react-router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    username: '',
    profile: null
  });
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, status, message } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) formPayload.append(key, value);
    });

    const result = await dispatch(registerUser(formPayload));
    
    if (registerUser.fulfilled.match(result)) {
      navigate('/verify-otp', { 
        state: { 
          email: formData.email,
          type: 'email_verification'
        } 
      });
    }
  };

  return (
    <FormWrapper title="Register" error={error} message={message}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded focus:ring focus:outline-none"
          />
          {preview && (
            <div className="mt-2">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded" 
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </div>
    </FormWrapper>
  );
}