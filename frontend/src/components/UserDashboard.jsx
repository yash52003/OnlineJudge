import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from './api';
import Cookies from 'js-cookie';

function UserDashboard() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('api/v2/getAllProblems');
        setProblems(response.data.problems);
      } catch (error) {
        console.error('Failed to fetch problems', error);
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Problems List</h2>
          {problems.length === 0 ? (
            <p>No problems available at the moment.</p>
          ) : (
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li key={problem._id} className="border-b pb-2 flex justify-between items-center">
                  <Link
                    to={`/problems/${problem._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {problem.problemName}
                  </Link>
                  <Link to={`/solve-problem/${problem._id}`}>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Solve Problem
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
