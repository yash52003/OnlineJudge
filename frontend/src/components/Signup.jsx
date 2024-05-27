import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from './api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted with the following details:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);

    try {
      const response = await instance.post('/api/v1/signup', {
        name,
        email,
        password,
        role,
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        console.log('Created the account successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setError('Failed to create account, please try again');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Signup</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              console.log('Name input changed:', e.target.value);
              setName(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              console.log('Email input changed:', e.target.value);
              setEmail(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              console.log('Password input changed:', e.target.value);
              setPassword(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role:</label>
          <select
            value={role}
            onChange={(e) => {
              console.log('Role selected:', e.target.value);
              setRole(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
