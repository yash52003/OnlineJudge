import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Online Judge</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
