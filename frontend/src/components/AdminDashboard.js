import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import instance from './api';
import Cookies from 'js-cookie';

function AdminDashboard() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate(); // Updated hook

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('/api/v2/getAllProblems');
        setProblems(response.data.problems);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error('No token found');
        }
        console.log(token);


        await instance.delete(`/api/v2/deleteProblem/${id}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
        });

        setProblems(problems.filter(problem => problem._id !== id));
    } catch (error) {
        console.error('Failed to delete problem', error);
    }
};


  const handleLogout = () => {
    // Clear the authentication token from cookies
    Cookies.remove('authToken');
    // Redirect to homepage
    navigate('/'); // Updated navigation
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Problems List</h2>
            <Link to="/create-problem">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Create Problem
              </button>
            </Link>
          </div>
          {problems.length === 0 ? (
            <p>No problems available at the moment.</p>
          ) : (
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li key={problem._id} className="border-b pb-4 flex justify-between items-center">
                  <span>{problem.problemName}</span>
                  <div className="space-x-2">
                    <Link to={`/problems/edit/${problem._id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
