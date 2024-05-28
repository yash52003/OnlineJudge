// src/components/AddProblem.js
import React, { useState } from 'react';
import instance from './api';
import { useNavigate } from 'react-router-dom';

const AddProblem = () => {
  const [problemName, setProblemName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [code, setCode] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post('/api/problems', {
        problemName,
        problemStatement,
        code,
        difficulty,
      }, {
        withCredentials: true,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Add Problem</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Problem Name:</label>
          <input
            type="text"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Problem Statement:</label>
          <textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
          Add Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
