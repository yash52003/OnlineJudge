import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from './api'; // Ensure this is the correct path to your axios instance
import Select from 'react-select';
import AceEditor from 'react-ace';
import ClipLoader from 'react-spinners/ClipLoader';

// Import the desired theme and language mode for syntax highlighting
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';

const languageOptions = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
];

function SolveProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [solution, setSolution] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error('No token found');
      }

      const response = await instance.post(`/api/v2/submitSolution/${id}`, {
        code: solution,
        language: language.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        if (response.data.finalVerdict === 'Accepted') {
          setVerdict({ message: 'Accepted', color: 'green' });
        } else if (response.data.finalVerdict === 'Wrong Answer') {
          setVerdict({ message: `Wrong Answer: Failed on test case ${response.data.failedTestCase}`, color: 'red' });
        } else {
          setVerdict({ message: response.data.finalVerdict || 'Incorrect Code', color: 'red' });
        }
      } else {
        if (response.data.failedTestCase !== null) {
          setVerdict({ message: `Failed on test case ${response.data.failedTestCase}`, color: 'red' });
        } else {
          setVerdict({ message: `${response.data.message || 'Incorrect Code'}, Failed on test case`, color: 'red' });
        }
      }
    } catch (error) {
      console.error('Failed to submit solution', error);
      setVerdict({ message: 'Incorrect Code', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ClipLoader color="#4A90E2" loading={true} size={35} />
      </div>
    );
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
          <p className="mb-4 whitespace-pre-wrap">{problem.problemStatement}</p>
        </div>
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col relative z-10">
          <Select
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            className="mb-4 z-20"
            styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
          />
          <AceEditor
            mode={language.value === 'cpp' ? 'c_cpp' : language.value}
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
          {loading ? (
            <div className="flex justify-center mt-4">
              <ClipLoader color="#4A90E2" loading={loading} size={35} />
            </div>
          ) : (
            <>
              {verdict && (
                <div className={`mt-4 text-${verdict.color}-500 font-bold`}>
                  {verdict.message}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default SolveProblem;
