import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaCode, FaArrowRight } from 'react-icons/fa';
import instance from './api';
import Cookies from 'js-cookie';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader
import { css } from '@emotion/react'; // Import css for styling

function UserDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('api/v2/getAllProblems');
        setProblems(response.data.problems);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      } finally {
        setLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchProblems();
  }, []);

  const handleLogout = () => {
    // Clear the authentication token from cookies
    Cookies.remove('token');
    // Redirect to homepage
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r to-indigo-600 bg-gray-100 text-gray-100 font-sans">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide flex items-center">
          <FaCode className="inline-block mr-2" />
          User Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </header>
      <main className="container mx-auto p-4">
        {loading ? ( // Check if loading is true
          <div className="flex justify-center items-center h-screen">
            <ClipLoader color="#4A90E2" loading={loading} size={35} />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Problems List</h2>
            {problems.length === 0 ? (
              <p className="text-gray-600">No problems available at the moment.</p>
            ) : (
              <ul className="space-y-4">
                {problems.map((problem) => (
                  <li key={problem._id} className="border-b pb-4 flex justify-between items-center">
                    <Link
                      to={`/problems/${problem._id}`}
                      className="text-xl text-indigo-600 hover:underline font-medium flex items-center"
                    >
                      {problem.problemName}
                      <FaArrowRight className="ml-2" />
                    </Link>
                    <Link to={`/solve-problem/${problem._id}`}>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
                        Solve Problem
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;

// SolveProblem.js remains unchanged with the loading spinner already added
