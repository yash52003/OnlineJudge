import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from './api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post('/api/v1/login', { email, password });

      if (response.data.success) {
        const { token, user } = response.data;
        // Store the token in local storage or cookies
        localStorage.setItem('token', token);

        // Redirect to appropriate dashboard based on the role
        if (user.role === 'Admin') {
          navigate('/adminDashboard');
        } else {
          navigate('/userDashboard');
        }

      }
    } catch (error) {
      console.log(error);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
