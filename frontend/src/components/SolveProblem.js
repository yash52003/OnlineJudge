import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from './api'; // Ensure this is the correct path to your axios instance
import Select from 'react-select';
import AceEditor from 'react-ace';

// Import the desired theme and language mode for syntax highlighting
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';

const languageOptions = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
];

function SolveProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [solution, setSolution] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await instance.get(`/api/v2/getProblem/${id}`);
        setProblem(response.data.problem);
      } catch (error) {
        setError('Failed to fetch the problem');
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error('No token found');
      }

      const response = await instance.post(`/api/v2/submitSolution/${id}`, {
        code: solution,
        language: language.value,
        token,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setVerdict({ message: response.data.finalVerdict, color: response.data.finalVerdict === 'Accepted' ? 'green' : 'red' });
      } else {
        setVerdict({ message: response.data.message || 'Incorrect', color: 'red' });
      }
    } catch (error) {
      console.error('Failed to submit solution', error);
      setVerdict({ message: 'Compilation Error', color: 'red' });
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Solve Problem</h1>
        <button
          onClick={() => navigate('/userDashboard')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Back to Dashboard
        </button>
      </header>
      <main className="flex-grow container mx-auto p-4 flex">
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{problem.problemName}</h2>
          <p className="mb-4">{problem.problemStatement}</p>
        </div>
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col relative z-10">
          <Select
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            className="mb-4 z-20"
            styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }} // Set z-index for the dropdown menu
          />
          <AceEditor
            mode={language.value}
            theme="dracula"
            value={solution}
            onChange={setSolution}
            className="flex-grow mb-4"
            style={{ width: '100%', height: '400px', overflowX: 'hidden', overflowY: 'auto' }}
            placeholder="Enter your solution here..."
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Submit Solution
          </button>
          {verdict && (
            <div className={`mt-4 text-${verdict.color}-500`}>
              {verdict.message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SolveProblem;
