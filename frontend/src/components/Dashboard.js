// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import instance from './api'; // Adjusted import path
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get('/api/user', {
          withCredentials: true,
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchProblems = async () => {
      try {
        const response = await instance.get('/api/problems', {
          withCredentials: true,
        });
        setProblems(response.data.problems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setLoading(false);
      }
    };

    fetchUserData();
    fetchProblems();
  }, []);

  const handleDeleteProblem = async (problemId) => {
    try {
      await instance.delete(`/api/problems/${problemId}`, {
        withCredentials: true,
      });
      setProblems(problems.filter(problem => problem._id !== problemId));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleAddProblem = () => {
    navigate('/add-problem');
  };

  const handleSolveProblem = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Problems Dashboard</h1>
      {userRole === 'Admin' && (
        <button 
          onClick={handleAddProblem}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Problem
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div key={problem._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{problem.problemName}</h2>
            <p className="mb-4">{problem.problemStatement}</p>
            <p className={`font-semibold ${problem.solved ? 'text-green-600' : 'text-red-600'}`}>
              {problem.solved ? 'Solved' : 'Not Solved'}
            </p>
            {userRole === 'Admin' ? (
              <div className="flex justify-between">
                <button
                  onClick={() => handleDeleteProblem(problem._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSolveProblem(problem._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Solve Problem
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
