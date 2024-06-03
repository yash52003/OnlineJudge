// Homepage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">Welcome to the Online Judge</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-300"
          >
            Signup
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
