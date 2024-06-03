import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from './api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    toast.success('Successfully logged in');
  };

  const handleLoginError = () => {
    toast.error('Invalid credentials, please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await instance.post('/api/v1/login', { email, password });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);

        if (user.role === 'Admin') {
          navigate('/adminDashboard');
        } else {
          navigate('/userDashboard');
        }
        handleLoginSuccess();
      }
    } catch (error) {
      console.log(error);
      handleLoginError();
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute top-4 left-4 cursor-pointer text-gray-600" onClick={redirectToHomepage}>
        <FiArrowLeft size={24} />
      </div>
      <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold  text-gray-800 mb-6">Welcome to Login Page</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
