// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import instance from './api';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('/api/problems', {
          withCredentials: true, // This ensures that cookies are included in the request
        });
        setProblems(response.data.problems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Problems Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div key={problem._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{problem.problemName}</h2>
            <p className="mb-4">{problem.problemStatement}</p>
            <p className={`font-semibold ${problem.solved ? 'text-green-600' : 'text-red-600'}`}>
              {problem.solved ? 'Solved' : 'Not Solved'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
