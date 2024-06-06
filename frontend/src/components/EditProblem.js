import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from './api';

function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problemName, setProblemName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await instance.get(`/api/v2/getProblem/${id}`);
        const { problemName, problemStatement, difficulty, testCases } = response.data.problem;
        setProblemName(problemName);
        setProblemStatement(problemStatement);
        setDifficulty(difficulty);
        setTestCases(testCases.map(tc => ({ _id: tc._id, input: tc.input, output: tc.output })));
      } catch (error) {
        console.error('Failed to fetch problem', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const updatedProblem = {
        problemName,
        problemStatement,
        difficulty,
        testCases,
        token,
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      await instance.put(`/api/v2/updateProblem/${id}`, updatedProblem, { headers });

      navigate('/adminDashboard');
    } catch (error) {
      console.error('Failed to update problem', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Problem</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="problemName">
              Problem Name
            </label>
            <input
              id="problemName"
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="problemStatement">
              Problem Statement
            </label>
            <textarea
              id="problemStatement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Test Cases
            </label>
            {testCases.map((testCase, index) => (
              <div key={index} className="mb-2">
                <div className="flex mb-2 space-x-2">
                  <input
                    type="text"
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    required
                    className="w-1/2 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    required
                    className="w-1/2 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Test Case
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate('/adminDashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProblem;
